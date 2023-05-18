import Temple from "./Temple"
import Card from "./Card/Card"
import ArtifactCard from "./Card/ArtifactCard"
import TreasureCard from "./Card/TreasureCard"
import HazardCard from "./Card/HazardCard"
import {TrashDeck, Deck} from "./Deck"
import Tunnel from "./Tunnel"
import Player from "./Player"
import Tent from "./Tent"
import Bag from "./Bag"

class Game{
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
        for(let i=0;i<num;i++){
            this.tents.push(new Tent(i+1));
            this.players.push(new Player(i+1,this.tents[i],this.tunnel));
        }
    }

    public getAndGo():void{
        // 即將離開通道的玩家
        var leavingPlayers = this.players.filter(player=>player.choice =="quit");
        // 🔺計算寶石總顆數；再進行平分(尚未處理)🔺
        
        // 分神器給要離開的玩家
        if(leavingPlayers.length==1){
            var artifacts = this.tunnel.cards.filter(card=>(card instanceof ArtifactCard))
            artifacts.forEach(artifact => { leavingPlayers[0].putInArtifactInBag(<ArtifactCard>artifact)})
        }
        // 讓這些玩家離開通道   
        leavingPlayers.forEach(player=>player.leaveTunnel());
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
    public putCardsInDeck():void{
        this.tunnel.cards.forEach(card=>{
            this.deck.appendCard(card)
            card.tunnel = null; // 卡片已不在通道內
        });
        this.tunnel.cards.splice(0,this.tunnel.cards.length);
    }
    
    // 找到贏家，記錄起來
    public findWinner():void{
        var maxPoints = 0;
        this.tents.forEach((tent)=>{
            if(tent.points>=maxPoints){
                maxPoints = tent.points;
                this.winnerID = tent.id;
            }
        })
    }

    public onRoundStart() : void{
        this.round ++;
        this.turn = 0;    
        HazardCard.initializeCounter(); // 重新計算災難卡的出現次數
        var artifact = this.temple.drawCard();
        if(artifact) this.deck.appendCard(artifact);
        this.deck.shuffle();
        this.players.forEach(player=>player.enterTunnel());
    }

    public onRoundEnd() : void{
        this.tunnel.discardInto(this.trashDeck);
        this.tunnel.remove();     
    }

    public onTurnStart() : void{
        this.turn ++;  // 當前回合的turn數 +1
        this.putCardInTunnel(); // 把卡放進通道內
        this.tunnel.cards[length-1].trigger(); // 觸發被放入通道的卡片效果
    }
}

export default Game;