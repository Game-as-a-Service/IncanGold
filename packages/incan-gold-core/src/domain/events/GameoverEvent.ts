import  Event from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

// 遊戲已結束
export default class GameoverEvent extends Event{
    public readonly winnerID:number|string;
    public players:PlayerAndPoints[];

    constructor(game:IncanGold){
        super(EventName.Gameover);
        this.winnerID = game.winnerID !== "" ? game.winnerID : "平手" ;

        this.players = [...game.players]
        .sort((p1,p2) => p2.points - p1.points )
        .map ( player => new PlayerAndPoints(player.id,player.points))
    }
}

class PlayerAndPoints{
    public playerID:string;
    public totalPoints:number;

    constructor(id:string, points:number){
        this.playerID = id;
        this.totalPoints = points;
    }
}