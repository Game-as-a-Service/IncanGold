import Card from "./Card/Card";
import ArtifactCard from "./Card/ArtifactCard";
import HazardCard from "./Card/HazardCard";
import TreasureCard from "./Card/TreasureCard";
import Player from "./Player";
import Bag from "./Bag";
import {TrashDeck} from "./Deck";
import IncanGold from "./IncanGold";

class Tunnel {
  private _players : Player[] = [];
  public cards : Card[] = [];
  public bags : Bag[] = [];
  public game : IncanGold;

  constructor(game:IncanGold){
    this.game = game;
  }

  set players(players:Player[]){
    this._players = players;
  }

  get players():Player[]{
    return this._players.filter(player=>player.inTent == false);
  }

  public appendCard(card: Card): void {
    this.cards.push(card);
  }

  public existNoPlayers():boolean{ 
    return (this.players.length == 0);
  }

  public getLastCard():Card{
    return this.cards[this.cards.length-1];
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
    // 災難卡放入廢棄排堆
    let lastCard = this.getLastCard();
    if(lastCard instanceof HazardCard && HazardCard.counter[lastCard.name]==2){
      trashDeck.appendCard(lastCard);
      lastCard.tunnel = null;
      this.cards.splice(this.cards.length-1,1)
    }
    
    // 丟棄所有神器卡
    var tmpCards: Card[] = [];
    this.cards.forEach((card) => {
      if (card instanceof ArtifactCard){
        trashDeck.appendCard(card);
        card.tunnel = null;
      } 
      else 
        tmpCards.push(card);
    });
    this.cards = tmpCards;

  }
}

export default Tunnel;
