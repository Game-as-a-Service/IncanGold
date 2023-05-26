import Card from "./Card";
import Tunnel from "../Tunnel";
import Gem from "../Gem";
import Player from "../Player";
import {Event,NewTurnTreasureCardTriggeredEvent} from "../../events/Event"

class TresasureCard extends Card {
  public readonly points: number;
  public gems: Gem[];

  constructor(points: number) {
    super();
    this.points = points;
    this.gems = [];
  }

  public generateGems(): void {
    for (let i = 0; i < this.points; i++) {
      this.gems.push(new Gem());
    }
  }

  public devideGemsTo(players:Player[]): void {
    // iterations:分配次數
    var iterations = Math.floor(this.gems.length/players.length);

    for(let i=0;i<iterations;i++){
      players.forEach(player=>{
        let gem = this.gems.pop();
        if(gem) player.putGemInBag(gem)
      });
    }
  }

  public trigger(): Event {
    this.generateGems();
    var players = this.tunnel?.players || [];
    if(players) this.devideGemsTo(players);

    const event:NewTurnTreasureCardTriggeredEvent = {
      name:'NewTurnTreasureCardTriggered',
      data:{
          currentTurn: this.tunnel?.game.turn || 1,
          cardPoints : this.points,
          numberOfGemsInBag : players[0].bag?.gems.length || 0,
          numberOfGemsOnCard : this.gems.length
      }
    }

    return event;
  }

  public clear():void{
    this.gems.splice(0,this.gems.length);
  }

}

export default TresasureCard;
