import Card from "./Card/Card"
import ArtifactCard from "./Card/ArtifactCard";
import HazardCard, {hazardNames} from "./Card/HazardCard"
import TreasureCard from "./Card/TreasureCard"


export class Deck{
    public cards : Card[] = [];

    constructor(){
        hazardNames.forEach(name=>{
            for(let i=0;i<3;i++)
                this.cards.push(new HazardCard(name));
        });
        
        var pointsList = [1, 2, 3, 4, 5, 7, 9, 11, 13, 14, 15, 17, 5, 7, 11]
        pointsList.forEach(points=>{
            this.cards.push(new TreasureCard(points));
        });
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

    public appendCard(card:Card) : void {
        this.cards.push(card);
    }

}

