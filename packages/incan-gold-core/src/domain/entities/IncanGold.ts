import Temple from "./Temple"
import Card from "./Card/Card"
import ArtifactCard from "./Card/ArtifactCard"
import TreasureCard from "./Card/TreasureCard"
import HazardCard from "./Card/HazardCard"
import {TrashDeck, Deck} from "./Deck"
import Tunnel from "./Tunnel"
import Player, {Choice} from "./Player"
import Tent from "./Tent"
import Gem from "./Gem"
import {Event,PlayerMadeChoiceEvent,AllPlayersMadeChoiceEvent,
AskPlayersToMakeChoiceEvent,AllocatedGemsAndArtifactsToPlayersEvent,
PutCardsBackIntoDeckAndRoundStartEvent,RoundEndEvent,GameoverEvent} from "../events/Event"

class IncanGold {
    public temple:Temple;
    public deck:Deck;
    public trashDeck:TrashDeck;
    public tunnel:Tunnel;
    public tents :Tent[] = [];
    public players:Player[] = [];

    public forcedExplore : boolean = false;
    public round:number = 0;
    public turn:number = 0;
    public winnerID:number = 0;

    constructor(){
        this.tunnel = new Tunnel(this);
        this.temple = new Temple();
        this.deck = new Deck();
        this.trashDeck = new TrashDeck();
    }

    // 配置有幾位玩家
    public setPlayerCount(num:number){
        for(let i=1;i<=num;i++){
            this.tents.push(new Tent(i));
            this.players.push(new Player(i,this.tents[i-1],this.tunnel));
        }
        this.tunnel.players = this.players;
    }

    // 通道中的玩家
    public getPlayersInTunnel():Player[]{
        return this.tunnel.players;
    }

    // 寄出『選擇』給玩家
    public askPlayers():Event{
        const event:AskPlayersToMakeChoiceEvent = {
            name :'AskPlayersToMakeChoice',
            data:{
                allPlayersInTunnel: this.tunnel.players.map(player=>player.id)
            }
        }

        if(this.forcedExplore){
            this.forcedExplore = false;
            event.name = 'NoChoice';
        }
        return event;
    }

    // 是否通道內的玩家都已做選擇
    public allPlayersMadeChoice():boolean{
        for(let player of this.tunnel.players){
            if(player.choice == Choice.NotSelected) return false;
        }
        return true;
    }

    // 回合結束的後續處理，可能開始新回合或是結束遊戲
    public handleRoundEnd(): Event[] {
        let events:Event[] = [];
        events.push(this.onRoundEnd());
        if(this.round!==5){   
            events.push(this.onRoundStart());
            events.push(this.onTurnStart()); 
        }else{
            events.push(this.findWinner());
        }
        return events;
    }

    // user_cmd(玩家做選擇)
    public *makeChoice(player:Player, choice:Choice){
        player.choice = choice;
        const event1:PlayerMadeChoiceEvent ={
            name:'PlayerMadeChoice',
            data:{playerWhoMadeChoice:player.id}
        }
        yield event1;

        if(this.allPlayersMadeChoice())
        {
            const event2:AllPlayersMadeChoiceEvent ={
                name:'AllPlayersMadeChoice',
                data:{allPlayersChoices:{}}
            }
            for(const player of this.tunnel.players){
                event2.data.allPlayersChoices[player.id] = player.choice;
            }
            yield event2

            yield this.getAndGo();

            if(this.tunnel.existNoPlayers()){
                yield* this.handleRoundEnd();
            }else{
                yield this.onTurnStart();
                if(this.tunnel.existNoPlayers())
                    yield* this.handleRoundEnd();
            }
        }

        yield this.askPlayers();
    }

    public getPlayer(id:number):Player{
        return this.players[id-1];
    }

    // 遊戲開始
    public gameStart():Event[]{
        const events:Event[] = []
        events.push(this.onRoundStart());
        events.push(this.onTurnStart());
        events.push(this.askPlayers());
        return events;
    }

    // 分寶石給要離開的玩家
    public AllocateAllGems(players:Player[]):void{
        let sum = 0; // 總寶石數
        let record:Map<Card, number> = new Map(); // 備份每張寶物卡有多少顆寶石
        let tempCards = Array.from(this.tunnel.cards);
        for(let card of tempCards.reverse()){
            if(card instanceof TreasureCard){
                sum += card.gems.length;
                record.set(card,card.gems.length);
                card.clear();
            }
        }

        let eachOneCanGet =  Math.floor(sum/players.length); // 離開的玩家各可以拿幾顆
        let left = sum - eachOneCanGet*(players.length) // 最後會剩下的寶石數

        for(let player of players){
            for(var i=0; i<eachOneCanGet;i++)
                player.putGemInBag(new Gem());
        }

        for(let i = left; i>0 ;){
            for(let [card,nums] of record){
                for(let j = 1;j<=nums; j++){
                    (<TreasureCard>card).gems.push(new Gem());
                    if((--i)==0) break;
                }
                if(i==0) break;
            }
        }
    }

    public getAndGo():Event{
        // 即將離開通道的玩家
        var leavingPlayers = this.players.filter(player=>player.choice == Choice.Quit);
        if(leavingPlayers.length !=0){
            this.AllocateAllGems(leavingPlayers);
            // 分神器給要離開的玩家
            if(leavingPlayers.length==1){
                var artifacts = this.tunnel.cards.filter(card=>(card instanceof ArtifactCard))
                artifacts.forEach(artifact => { leavingPlayers[0].putInArtifactInBag(<ArtifactCard>artifact)})
            }
        }

        const event:AllocatedGemsAndArtifactsToPlayersEvent = {
            name:'AllocatedGemsAndArtifactsToPlayer',
            data:{
                leavingplayersID: leavingPlayers.map(player=>player.id),
                artifactsInBag: [],
                numberOfGemsInBag: 0,
                numberOfGemsOnCard:{}
            }
        }
        if(leavingPlayers.length>=1){
            event.data.artifactsInBag = leavingPlayers[0].bag?.artifactCards.map(artifact=>artifact.name)||[];
            event.data.numberOfGemsInBag = leavingPlayers[0].bag?.gems.length || 0;
        }
        
        for(const card of this.tunnel.cards){
            if (card instanceof TreasureCard && card.gems.length)
                event.data.numberOfGemsOnCard[card.points]=card.gems.length;
        }

        // 讓這些玩家離開通道   
        for(let player of leavingPlayers) player.leaveTunnel();

        return event;
    }

    // 從牌堆抽牌放入通道
    public putCardInTunnel():void{
        var card = this.deck.drawCard()
        if(card){
            this.tunnel.appendCard(card);
            card.tunnel = this.tunnel;
        }
    }

    // 把通道中的牌放回牌堆
    public putCardsBackIntoDeck():void{
        this.tunnel.cards.forEach(card=>{
            this.deck.appendCard(card)
            card.tunnel = null; // 卡片已不在通道內
        });
        this.tunnel.cards.splice(0);
    }
    
    // 找到贏家，記錄起來
    public findWinner():Event{
        var maxPoints = 0;
        this.tents.forEach((tent)=>{
            if(tent.points>=maxPoints){
                maxPoints = tent.points;
                this.winnerID = tent.id;
            }
        })
        const event:GameoverEvent ={
            name:"Gameover",
            data:{ winnerID:this.winnerID }
        };
        return event;
    }

    public onRoundStart() : Event {
        this.putCardsBackIntoDeck(); 
        this.round ++;
        this.turn = 0;    
        HazardCard.initializeCounter(); // 重新計算災難卡的出現次數 
        var artifact = this.temple.drawCard();
        if(artifact) this.deck.appendCard(artifact);
        this.deck.shuffle();
        this.players.forEach(player=>player.enterTunnel());

        const event:PutCardsBackIntoDeckAndRoundStartEvent = {
            name: 'PutCardsBackIntoDeckAndRoundStart',
            data:{ currentRound :this.round }
        }
        return event;
    }

    public onRoundEnd() : Event {
        let lastCard = this.tunnel.getLastCard();
        const event:RoundEndEvent = {
            name:'RoundEnd',
            data:{
                discardedHazardCard:"", 
            }
        }
        if(lastCard instanceof HazardCard && HazardCard.counter[lastCard.name]==2)
            event.data.discardedHazardCard = lastCard.name;

        this.tunnel.discardInto(this.trashDeck);
        this.tunnel.remove();     

        return event;
    }

    public onTurnStart() : Event {
        this.turn ++;  // 當前回合的turn數 +1
        this.putCardInTunnel(); // 把卡放進通道內
        const newCard = this.tunnel.cards[this.tunnel.cards.length-1];
        return newCard.trigger(); // 觸發被放入通道的卡片效果
    }
}

export default IncanGold;