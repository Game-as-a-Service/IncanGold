import Artifact from "./Artifact";
import Gem from "./Gem";

class Bag {
  private _points: number = 0;
  public artifacts: Artifact[] = [];
  public gems: Gem[] = [];

  get points(){
    return this._points;
  }

  get numOfGems(){
    return this.gems.length;
  }

  get numOfArtifacts(){
    return this.artifacts.length;
  }

  public putGemsIn(gems: Gem[]): void {
    this._points += gems.length;
    this.gems = this.gems.concat(gems);
  }

  public putArtifactsIn(artifacts: Artifact[]): void {
    artifacts.forEach(artifact=>{this._points += artifact.points;})
    this.artifacts = this.artifacts.concat(artifacts);

  }

}
export default Bag;
