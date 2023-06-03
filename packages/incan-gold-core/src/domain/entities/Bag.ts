import ArtifactCard from "./Card/ArtifactCard";
import Gem from "./Gem";

class Bag {
  private _points: number = 0;
  public artifactCards: ArtifactCard[];
  public gems: Gem[];

  constructor() {
    this.artifactCards = [];
    this.gems = []; 
  }

  get points(){
    return this._points;
  }

  get numOfGems(){
    return this.gems.length;
  }

  get numOfArtifactCards(){
    return this.artifactCards.length;
  }

  public putGemsIn(gems: Gem[]): void {
    this._points += gems.length;
    this.gems = this.gems.concat(gems);
  }

  public putArtifactsIn(artifactCards: ArtifactCard[]): void {
    artifactCards.forEach(artifact=>{this._points += artifact.points;})
    this.artifactCards = this.artifactCards.concat(artifactCards);
  }

}
export default Bag;
