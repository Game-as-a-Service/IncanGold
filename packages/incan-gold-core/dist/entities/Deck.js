import HazardCard, { hazardNames } from "./Card/HazardCard";
import TreasureCard from "./Card/TreasureCard";
export class Deck {
    cards = [];
    constructor() {
        hazardNames.forEach(name => {
            for (let i = 0; i < 3; i++)
                this.cards.push(new HazardCard(name));
        });
        // 5 11 13 是我自己捕的，找不到剩下3張神器卡的分數
        var pointsList = [1, 2, 3, 4, 5, 7, 9, 11, 13, 14, 15, 17, 5, 11, 13];
        pointsList.forEach(points => {
            this.cards.push(new TreasureCard(points));
        });
    }
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    appendCard(card) {
        this.cards.push(card);
    }
    drawCard() {
        return this.cards.pop();
    }
}
export class TrashDeck {
    cards = [];
    appendCard(card) {
        this.cards.push(card);
    }
}
export default {
    Deck,
    TrashDeck
};