import Player from "./Player";
import Bag from "./Bag"
import ArtifactCard from "./Card/ArtifactCard"

class Tent {
  public readonly id: number;
  private _points: number;
  public player: Player | null = null;
  public artifacts: ArtifactCard[] = [];

  constructor(id: number) {
    this.id = id;
    this._points = 0;
  }

  get points(){
    return this._points;
  }

  public updatePoints(): void {
    if(this.player?.bag){
      this._points += this.player.bag.points;
      this.player.bag.artifactCards.forEach(artifact=>{
        this.artifacts.push(artifact);
      })
      this.player.leaveBag();
    }
  }
}

export default Tent;
