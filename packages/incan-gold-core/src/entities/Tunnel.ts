import Card from "./Card/Card";
import ArtifactCard from "./Card/ArtifactCard";
import HazardCard from "./Card/HazardCard";
import TreasureCard from "./Card/TreasureCard";
import Player from "./Player";
import Bag from "./Bag";
import {TrashDeck} from "./Deck";
import Game from "./Game";

class Tunnel {
  public players : Player[] = [];
  public cards : Card[] = [];
  public bags : Bag[] = [];
  public game : Game;

  constructor(game:Game){
    this.game = game;
  }

  public appendCard(card: Card): void {
    this.cards.push(card);
  }

  public remove(): void {
    // 1.移除背包
    this.bags.splice(0,this.bags.length);
    // 2.移除寶物卡上的寶石
    for(let card of this.cards){
    	if(card instanceof TreasureCard)
    		card.clear();
    }
  }

  public discardInto(trashDeck:TrashDeck): void {
    // 丟棄所有神器卡
    var tmpCards: Card[] = [];
    this.cards.forEach((card) => {
      if (card instanceof ArtifactCard) 
        trashDeck.appendCard(card);
      else 
        tmpCards.push(card);
    });
    this.cards = tmpCards;

    // 災難卡放入廢棄排堆
    var index = 0;
    for(let [name, times] of HazardCard.counter){
      if(times == 2){
        var hazardCard = this.cards.find(card=>{
          index ++;
          return((card instanceof HazardCard) && (card.name == name))
        });

        if(hazardCard) trashDeck.appendCard(hazardCard);
        this.cards.splice(index,1);
        break; 
      }
    }
  }
}

export default Tunnel;
