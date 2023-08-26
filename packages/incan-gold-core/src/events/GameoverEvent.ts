import  Event from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

// 遊戲已結束
export default class GameOverEvent extends Event{
    public readonly winnerId:string;
    public explorers:ExplorerAndPoints[];

    constructor(game:IncanGold){
        super(EventName.GameOver);
        this.winnerId = game.winnerId !== "" ? game.winnerId : "平手" ;

        this.explorers = [...game.explorers]
        .sort((p1,p2) => p2.points - p1.points )
        .map ( explorer => new ExplorerAndPoints(explorer.id,explorer.points))
    }
}

class ExplorerAndPoints{
    public explorerId:string;
    public totalPoints:number;

    constructor(id:string, points:number){
        this.explorerId = id;
        this.totalPoints = points;
    }
}