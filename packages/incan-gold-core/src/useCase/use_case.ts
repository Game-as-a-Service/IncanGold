import Game from '../entities/Game'


class GameService {

    public game : Game;

    constructor(){
        this.game = new Game();
    }

    // 結束遊戲 method
    public askPlayers():void;


    // 🔺 要求使用者選擇 method 🔺
    public askPlayers():void{
        if(this.game.forcedExplore == false){
            throw "請選擇離開通道或繼續探險";
        }else{
            this.game.forcedExplore = false;
            // 寄出不可以選擇的訊息
            throw "沒得選，給我探險";
        }
    }

    public afterRoundEnd():void {
        if(this.game.round!==5){   
            this.game.putCardsInDeck(); 
            this.game.onRoundStart();
            this.game.onTurnStart(); 
        }else{
            this.game.findWinner();
            // 結束遊戲，顯示玩家?獲勝
            // throw (`Player_${this.game.winnerID} win this game.`);
        }
    }

    // 等待玩家的選擇結束後要走的流程 ， return
    public afterPlayersChoice(playersChoices:string[]):any{
        // 1. 根據接收到的選擇更改玩家狀態
        for(let i=0;i<this.game.players.length;i++){
            this.game.players[i].choice = playersChoices[i];
        }

        // 2. 公布玩家選擇
        for(let player of this.game.players) // 應該不能是console.log
            console.log(`player${player.id} choose ${player.choice}`);
        
        // 3. 分配寶石&神器，並讓要離開的玩家離開通道
        this.game.getAndGo() 
        if(this.game.tunnel.existNoPlayers()){
            this.game.onRoundEnd();
            this.afterRoundEnd();
        }else{
            this.game.onTurnStart();
            if(this.game.tunnel.existNoPlayers()){
                this.game.onRoundEnd();
                this.afterRoundEnd();
            }
        }

        // 4. 要求使用者選擇
        return this.askPlayers();
    }

    // 遊戲開始
    public gameStart():void{
        // 提醒我自己要開出給定各種物件的函式
        this.game.onRoundStart();
        this.game.onTurnStart();
        // 要求使用者選擇
        this.askPlayers();
    }
}

export default GameService;
