import Card from "./Card";
import Gem from "../Gem";
import Explorer from "../Explorer";
import IncanGold from "../IncanGold";
import Event from "../../events/Event";
import {NewTurnTreasureCardTriggeredEvent} from "../../events/NewTurnCardTriggeredEvent";

export default class TreasureCard extends Card {
  public readonly points: number;
  public gems: Gem[] = [];

  constructor(cardID:string, points: number) {
    super(cardID);
    this.points = points;
  }

  public generateGems(): void {
    this.gems = Array(this.points).fill(new Gem());
  }

  public clear():void{
    this.gems = [];
  }

  get numOfGems():number{
    return this.gems.length;
  }

  public devideGemsTo(explorers:Explorer[]): void {
    var eachOneCanGet = Math.floor(this.numOfGems/explorers.length); 
    var left = this.numOfGems- (eachOneCanGet*explorers.length);
    explorers.forEach(explorer=>explorer.putGemsInBag(Array(eachOneCanGet).fill(new Gem())));
    this.gems = Array(left).fill(new Gem());
  }

  public trigger(game:IncanGold): Event {
    this.generateGems();
    this.devideGemsTo(game.explorersInTunnel);
    return new NewTurnTreasureCardTriggeredEvent(game);
  }
}