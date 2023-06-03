import Card from "./Card/Card"
import HazardCard, {hazardNames} from "./Card/HazardCard"
import TreasureCard, {pointsList} from "./Card/TreasureCard"

export class Deck{
    public cards : Card[] = [];

    constructor(){
        hazardNames.forEach(name=>{ this.cards = this.cards.concat(Array(2).fill(new HazardCard(name))) });
        // 調回3張
        pointsList.splice(0,2).forEach(points=>{ this.cards.push(new TreasureCard(points)) });
    }

    get numofCards():number{
        return this.cards.length;
    } 

    public shuffle() : void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public appendCard(card:Card) : void {
        this.cards.push(card);
    }

    public drawCard() : Card|undefined {
        return this.cards.pop();
    }
}

export class TrashDeck{
    public cards : Card[] = [];

    get numofCards():number{
        return this.cards.length;
    } 

    public appendCard(card:Card) : void {
        this.cards.push(card);
    }

}

