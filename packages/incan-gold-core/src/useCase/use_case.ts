import Game from '../entities/Game'


class GameService {
    
    public game : Game;

    constructor(){
        this.game = new Game();
    }

    // 結束遊戲 method

    
    // 🔺 要求使用者選擇 method 🔺
    public askPlayers():void{
        if(this.game.forcedExplore == false){
            // 寄出可以選擇的訊息
        }else{
            this.game.forcedExplore = false;
            // 寄出不可以選擇的訊息
        }
    }

    public afterRoundEnd():void{
        if(this.game.round!==5){   
            this.game.putCardsInDeck(); 
            this.game.onRoundStart();
            this.game.onTurnStart(); // 甭擔心拋例外，第 1 Turn 絕不會被迫結束
        }else{
            this.game.findWinner();
            // 結束遊戲，顯示玩家?獲勝
            // throw (`Player_${this.game.winnerID} win this game.`);
        }
    }

    // 等待玩家的選擇結束後要走的流程
    public afterPlayersChoice(playersChoices:string[]):void{
        // 1. 根據接收到的選擇更改玩家狀態
        for(let i=0;i<this.game.players.length;i++){
            this.game.players[i].choice = playersChoices[i];
        }
        
        // 2. 公布玩家選擇
        for(let player of this.game.players) // 應該不能是console.log
            console.log(`player${player.id} choose ${player.choice}`);
        
        // 3. 分配寶石&神器，並讓要離開的玩家離開通道
        var nextTurn = true;
        try   { this.game.getAndGo()   }  // 可能所有玩家都自願離開通道
        catch {
            this.game.onRoundEnd(); // 回合結束 
            this.afterRoundEnd(); 
            nextTurn = false; 
        }

        if(nextTurn){
            try   { this.game.onTurnStart()} // 可能災難卡重複出現，所有玩家都被迫離開通道
            catch { 
                this.game.onRoundEnd(); // 回合結束
                this.afterRoundEnd(); 
            }
        }

        // 4. 要求使用者選擇
        
    }

    // 遊戲開始
    public gameStart():void{
        // 提醒我自己要開出給定各種物件的函式
        this.game.onRoundStart();
        this.game.onTurnStart();
        // 要求使用者選擇
    }
}

export default GameService;
