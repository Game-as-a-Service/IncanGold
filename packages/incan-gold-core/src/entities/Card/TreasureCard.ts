import Card from "./Card";
import Gem from "../Gem";
import Explorer from "../Explorer";
import IncanGold from "../IncanGold";
import { Event } from "../../events/Event";
import { NewTurnTreasureCardTriggeredEvent } from "../../events/NewTurnCardTriggeredEvent";
import { treasureCards } from "../../constant/CardInfo";

export default class TreasureCard extends Card {
  public readonly points: number;
  public gems: Gem[];

  constructor(id: string, remainingGems?: number) {
    super(id);
    if (treasureCards[id] === undefined) throw new Error(`id: ${id} does not exist.`);
    this.points = treasureCards[id];
    this.gems = remainingGems === undefined ? [] : Array(remainingGems).fill(new Gem());
  }

  public generateGems(): void {
    this.gems = Array(this.points).fill(new Gem());
  }

  public clear(): void {
    this.gems = [];
  }

  get numOfGems(): number {
    return this.gems.length;
  }

  public distributeGemsTo(explorers: Explorer[]): void {
    var eachOneCanGet = Math.floor(this.numOfGems / explorers.length);
    var left = this.numOfGems - (eachOneCanGet * explorers.length);
    explorers.forEach(explorer => explorer.putGemsInBag(Array(eachOneCanGet).fill(new Gem())));
    console.log(left);
    this.gems = Array(left).fill(new Gem());
  }

  public trigger(game: IncanGold): Event {
    this.generateGems();
    this.distributeGemsTo(game.explorersInTunnel);
    return NewTurnTreasureCardTriggeredEvent(game);
  }
}