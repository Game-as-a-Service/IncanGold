import Card from "./Card";
import Tunnel from "../Tunnel";
import Gem from "../Gem";
import Player from "../Player";

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

  public trigger(): void {
    this.generateGems();
    var players = this.tunnel?.players.filter(player=>player.inTent === false);
    if(players) this.devideGemsTo(players);
  }

  public clear():void{
    this.gems.splice(0,this.gems.length);
  }

}

export default TresasureCard;
