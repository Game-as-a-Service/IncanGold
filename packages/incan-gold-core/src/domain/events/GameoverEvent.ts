import  Event,{ EventName } from "./Event";
import IncanGold from "../entities/IncanGold";

// 遊戲已結束
export default class GameoverEvent extends Event{
    public readonly winnerID:number|string;

    constructor(game:IncanGold){
        super(EventName.Gameover);
        this.winnerID = game.winnerID !== 0 ? game.winnerID : "平手" ;
    }
}
