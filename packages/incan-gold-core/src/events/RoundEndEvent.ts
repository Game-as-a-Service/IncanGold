import { Event } from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

// 回合結束
// export default class RoundEndEvent extends Event {
//     public currentRound: number;
//     public discardedCardsId: string[]; // 這回合被丟棄進廢棄牌堆的卡片id

//     constructor(game: IncanGold) {
//         super(EventName.RoundEnd);
//         this.currentRound = game.round;

//         this.discardedCardsId =
//             game.trashDeck.cards.get(this.currentRound)
//                 ?.map(card => card.id) || [];
//     }
// }
export interface RoundEndEvent extends Event {
    name: EventName.RoundEnd;
    data: {
        round: number,
        discardedCardIds: string[]
    }
}

export function RoundEndEvent(game: IncanGold): Event {
    const name = EventName.RoundEnd;
    const { round, trashDeck } = game;

    const cards = trashDeck.get(round);
    const discardedCardIds = !!cards ? cards.map(card => card.id) : [];

    return Event(name, { round, discardedCardIds })
}