import Card from "./Card/Card"
import { hazardCards,treasureCards } from "../constant/CardInfo";
import HazardCard from "./Card/HazardCard"
import TreasureCard from "./Card/TreasureCard"

export class Deck{
    public cards : Card[];

    constructor(cards:Card[] = []){
        if(cards.length)
            this.cards = cards;
        else{
            this.cards = [];
            treasureCards.forEach( card => { this.cards.push(new TreasureCard(card.ID, card.points)) });
            hazardCards.forEach( card => { this.cards.push(new HazardCard(card.ID, card.name)) });   
        }
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
    public cards : Map<number, Card[]>;

    public constructor( cards : Map<number, Card[]>) {
        if(cards.get(1))
            this.cards = cards;
        else{
            this.cards = new Map();
            [1,2,3,4,5].forEach(round=>{
                this.cards.set( round, []);
            })
        }
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
