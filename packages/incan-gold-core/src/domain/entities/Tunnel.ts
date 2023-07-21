import Card from "./Card/Card";
import ArtifactCard from "./Card/ArtifactCard";
import HazardCard from "./Card/HazardCard";
import TreasureCard from "./Card/TreasureCard";
import Player from "./Player";
import Bag from "./Bag";
import { TrashDeck } from "./Deck";
import Gem from "./Gem";
import { Choice } from "../constant/Choice";
import IncanGold from "./IncanGold";

class Tunnel {
  private _players : Player[] = [];
  public cards : Card[];

  constructor(cards:Card[]){
    if(cards.length)
      this.cards = cards;
    else
      this.cards = [];
  }

  set players(players:Player[]) {
    this._players = players;
  }

  get players():Player[] {
    return this._players.filter(player=>player.inTent === false);
  }

  get leavingPlayers(): Player[] {
    return this.players.filter(player=>player.choice === Choice.Quit);
  }

  get isAnyPlayerPresent():boolean { 
    return (this.players.length !== 0);
  }

  get lastCard():Card {
    return this.cards[this.cards.length-1];
  }

  public appendCard(card: Card): void {
    this.cards.push(card);
  }

  public drawArtifactCards():ArtifactCard[]{
    var tmpCards : Card[] = [];
    var returnCards : ArtifactCard[] = [];
    this.cards.forEach((card) => {
      if (card instanceof ArtifactCard)
        returnCards.push(card);
      else 
        tmpCards.push(card);
    });
    this.cards = tmpCards;
    return returnCards;
  }

  // 移除寶物卡上的寶石
  public remove(): void {
    this.cards.forEach(card=>{
      if(card instanceof TreasureCard) card.clear();
    })
  }

  public discardCards(game:IncanGold): void {
    // 災難卡放入廢棄排堆
    let lastCard = this.lastCard;
    if(lastCard instanceof HazardCard && game.hazardCardCounter[lastCard.name]==2){
      game.trashDeck.appendCards(game.round, [lastCard]);
      this.cards.splice(this.cards.length-1,1)
    }
    
    // 丟棄所有神器卡
    game.trashDeck.appendCards(game.round, this.drawArtifactCards());
  }

  // 分寶石給要離開的玩家
  public distributeAllGems():void{
    let players = this.leavingPlayers;
    let sum = 0; // 總寶石數
    let record:Map<TreasureCard, number> = new Map(); // 備份每張寶物卡有多少顆寶石
    Array.from(this.cards)
        .reverse()
        .filter(card=>(card instanceof TreasureCard))
        .forEach(card => {
            let treasureCard = (<TreasureCard>card);
            sum += treasureCard.numOfGems;
            record.set(treasureCard,treasureCard.numOfGems);
            treasureCard.clear();
        })

    let eachOneCanGet =  Math.floor(sum/players.length); // 離開的玩家各可以拿幾顆
    let left = sum - eachOneCanGet*(players.length) // 分配後剩下的寶石數
    players.forEach(player=>player.putGemsInBag(Array(eachOneCanGet).fill(new Gem())));

    for(let [card,nums] of record){
        let numsOfGems = nums > left ? left : nums;
        card.gems = Array(numsOfGems).fill(new Gem());
        if((left-=numsOfGems)<=0) break;
    }
  }

  public distributeArtifacts():void{
    if(this.leavingPlayers.length === 1){
      let artifacts = this.cards
      .filter(card=>(card instanceof ArtifactCard))
      .map(card => (<ArtifactCard>card).giveArtifact());

      this.leavingPlayers[0].putInArtifactsInBag(artifacts);
    }
  }
}

export default Tunnel;
