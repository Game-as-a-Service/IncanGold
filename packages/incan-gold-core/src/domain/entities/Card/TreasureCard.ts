import Card from "./Card";
import Gem from "../Gem";
import Player from "../Player";
import IncanGold from "../IncanGold";
import Event from "../../events/Event";
import {NewTurnTreasureCardTriggeredEvent} from "../../events/NewTurnCardTriggeredEvent";

export const pointsList = [1, 2, 3, 4, 5, 5, 7, 7, 9, 11, 11, 13, 14, 15, 17];

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

  public devideGemsTo(players:Player[]): void {
    var eachOneCanGet = Math.floor(this.numOfGems/players.length); 
    var left = this.numOfGems- (eachOneCanGet*players.length);
    players.forEach(player=>player.putGemsInBag(Array(eachOneCanGet).fill(new Gem())));
    this.gems = Array(left).fill(new Gem());
  }

  public trigger(game:IncanGold): Event {
    this.generateGems();
    this.devideGemsTo(game.playersInTunnel);
    return new NewTurnTreasureCardTriggeredEvent(game);
  }
}

