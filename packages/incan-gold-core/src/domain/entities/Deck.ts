import Card from "./Card/Card"
import HazardCard, {hazardNames} from "./Card/HazardCard"
import TreasureCard, {pointsList} from "./Card/TreasureCard"

export class Deck{
    public cards : Card[] = [];

    constructor(){
        pointsList.forEach((points,index)=>{ this.cards.push(new TreasureCard(("T"+points),points)) });
        [5,7,11].forEach(points=>{
            let cards = this.cards.filter(card=>new RegExp('^T' + points).test(card.cardID));
            cards[0].cardID += "(1)" ;
            cards[1].cardID += "(2)" ;
        })
        
        hazardNames.forEach(name=>{ 
            let cardID =  "H" + name.charAt(0).toUpperCase(); // HF (fire)
            let ids = Array(3).fill(cardID).map( (cardID,index) => (cardID + (index+1)) ) // HF1,HF2...
            let hazardCards = ids.map(id=>new HazardCard(id,name));
            this.cards = this.cards.concat(hazardCards);
        });
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
    public cards : Map<number, Card[]> = new Map();

    public constructor() {
        this.cards = new Map();
        [1,2,3,4,5].forEach(round=>{
            this.cards.set( round, []);
        })
    }

    get numofCards():number{
        let num = 0; 
        this.cards.forEach(cards=>{
            num += cards.length;
        });
        return num;
    } 

    public appendCards(currentRound:number, cards:Card[]) : void {
            this.cards.set( currentRound, (this.cards.get(currentRound)||[]).concat(cards));
    }
}

export default {
    Deck,
    TrashDeck
}
