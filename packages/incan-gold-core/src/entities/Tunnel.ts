import Card from "./Card/Card";
import ArtifactCard from "./Card/ArtifactCard";
import HazardCard from "./Card/HazardCard";
import TreasureCard from "./Card/TreasureCard";
import Explorer from "./Explorer";
import Bag from "./Bag";
import { TrashDeck } from "./Deck";
import Gem from "./Gem";
import { Choice } from "../constant/Choice";
import IncanGold from "./IncanGold";

class Tunnel {
  private _explorers: Explorer[] = [];
  public cards: Card[];

  constructor(cards: Card[]) {
    this.cards = cards.length ? cards : [];
  }

  set explorers(explorers: Explorer[]) {
    this._explorers = explorers;
  }

  get explorers(): Explorer[] {
    return this._explorers.filter(explorer => explorer.inTent === false);
  }

  get isHazardCardDuplicated() {
    const hazards = this.cards
      .filter(card => card.id.startsWith("H"))
      .map(card => card.id[1]);
    const set = new Set(hazards);
    return set.size < hazards.length;
  }

  get leavingExplorers(): Explorer[] {
    return this.explorers.filter(explorer => explorer.choice === Choice.Quit);
  }

  get isAnyExplorerPresent(): boolean {
    return (this.explorers.length !== 0);
  }

  get lastCard(): Card {
    return this.cards[this.cards.length - 1];
  }

  public appendCard(card: Card): void {
    this.cards.push(card);
  }

  public drawArtifactCards(): ArtifactCard[] {
    var tmpCards: Card[] = [];
    var returnCards: ArtifactCard[] = [];
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
    this.cards.forEach(card => {
      if (card instanceof TreasureCard) card.clear();
    })
  }

  public discardCards(game: IncanGold): void {
    // 災難卡放入廢棄排堆
    if (this.isHazardCardDuplicated) {
      game.trashDeck.appendCards(game.round, [this.lastCard]);
      this.cards.splice(this.cards.length - 1, 1)
    }

    // 丟棄所有神器卡
    game.trashDeck.appendCards(game.round, this.drawArtifactCards());
  }

  // 分寶石給要離開的玩家
  public distributeAllGems(): void {
    let explorers = this.leavingExplorers;
    let sum = 0; // 總寶石數
    let record: Map<TreasureCard, number> = new Map(); // 備份每張寶物卡有多少顆寶石
    Array.from(this.cards)
      .reverse()
      .filter(card => (card instanceof TreasureCard))
      .forEach(card => {
        let treasureCard = (<TreasureCard>card);
        sum += treasureCard.numOfGems;
        record.set(treasureCard, treasureCard.numOfGems);
        treasureCard.clear();
      })

    let eachOneCanGet = Math.floor(sum / explorers.length); // 離開的玩家各可以拿幾顆
    let left = sum - eachOneCanGet * (explorers.length) // 分配後剩下的寶石數
    explorers.forEach(explorer => explorer.putGemsInBag(Array(eachOneCanGet).fill(new Gem())));

    for (let [card, nums] of record) {
      let numsOfGems = nums > left ? left : nums;
      card.gems = Array(numsOfGems).fill(new Gem());
      if ((left -= numsOfGems) <= 0) break;
    }
  }

  public distributeArtifacts(): void {
    if (this.leavingExplorers.length === 1) {
      let artifacts = this.cards
        .filter(card => (card instanceof ArtifactCard))
        .map(card => (<ArtifactCard>card).giveArtifact());

      this.leavingExplorers[0].putInArtifactsInBag(artifacts);
    }
  }
}

export default Tunnel;
