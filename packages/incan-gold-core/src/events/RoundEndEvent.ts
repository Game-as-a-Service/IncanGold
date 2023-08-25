import Event from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

// 回合結束
export default class RoundEndEvent extends Event{
    public currentRound:number;
    public discardedCardsID: string[]; // 這回合被丟棄進廢棄牌堆的卡片id
    
    constructor(game:IncanGold){
        super(EventName.RoundEnd);
        this.currentRound = game.round;

        this.discardedCardsID = 
        game.trashDeck.cards.get(this.currentRound)
        ?.map(card => card.id) || [];
    }
}