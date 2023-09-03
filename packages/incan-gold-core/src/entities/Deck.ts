import Card from "./Card/Card"
import { hazardCards, treasureCards } from "../constant/CardInfo";
import HazardCard from "./Card/HazardCard"
import TreasureCard from "./Card/TreasureCard"

export class Deck {
    public cards: Card[];

    constructor(cards: Card[] = []) {
        if (cards.length)
            this.cards = cards;
        else {
            const cards: Card[] = [...Object.keys(treasureCards)].map(id => new TreasureCard(id));
            this.cards = cards.concat([...Object.keys(hazardCards)].map(id => new HazardCard(id)));
        }
    }

    get numOfCards(): number {
        return this.cards.length;
    }

    public shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public appendCard(card: Card): void {
        this.cards.push(card);
    }

    public drawCard(): Card | undefined {
        return this.cards.pop();
    }
}

export class TrashDeck {
    public cards: Map<number, Card[]>;

    constructor(cards: Map<number, Card[]>) {
        const hasContent = [...cards.entries()].length !== 0;
        this.cards = hasContent ? cards : this.setupCards();
    }

    get numOfCards(): number {
        return [...this.cards.values()]
            .map(cards => cards.length)
            .reduce((num, len) => num + len, 0);
    }

    appendCards(currentRound: number, cards: Card[]): void {
        this.cards.set(currentRound, (this.cards.get(currentRound) || []).concat(cards));
    }

    get(round: number) {
        return this.cards.get(round);
    }

    private setupCards() {
        const cards = new Map<number, Card[]>();
        [1, 2, 3, 4, 5].forEach(round => {
            cards.set(round, []);
        });
        return cards;
    }
}

export default {
    Deck,
    TrashDeck
}
