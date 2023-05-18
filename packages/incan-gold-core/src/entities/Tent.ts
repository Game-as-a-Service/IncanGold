import Player from "./Player";
import Bag from "./Bag"

class Tent {
  public readonly id: number;
  public points: number;
  public player: Player | null = null;
  public bags:Bag[] = [];

  constructor(id: number) {
    this.id = id;
    this.points = 0;
  }

  public updatePoints(): void {
    if(this.player?.bag){
      this.points += this.player.bag.points;
      var bag = this.player?.leaveBag();
      if(bag) this.bags.push(bag);
    }
  }
}

export default Tent;
