import Event, { EventName } from "./Event";
import IncanGold from "../entities/IncanGold";
import HazardCard from "../entities/Card/HazardCard";


// 回合結束
export default class RoundEndEvent extends Event{
    public currentRound:number;
    public discardedHazardCard: string = ''; // 要被丟棄的進廢棄牌堆的災難卡名稱
    
    constructor(game:IncanGold){
        super(EventName.RoundEnd);
        this.currentRound = game.round;

        let lastCard = game.tunnel.lastCard;
        if(lastCard instanceof HazardCard && game.hazardCardCounter[lastCard.name]==2)
            this.discardedHazardCard = lastCard.name;
    }
}