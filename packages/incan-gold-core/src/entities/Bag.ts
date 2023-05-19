import ArtifactCard from "./Card/ArtifactCard";
import Gem from "./Gem";

class Bag {
  public points: number;
  public artifactCards: ArtifactCard[];
  public gems: Gem[];

  constructor() {
    this.points = 0;
    this.artifactCards = [];
    this.gems = []; 
  }

  public putGemIn(gem: Gem): void {
    this.gems.push(gem);
    this.points += gem.points;
  }

  public putArtifactIn(artifact: ArtifactCard): void {
    this.artifactCards.push(artifact);
    artifact.tunnel = null;
    this.points += artifact.points;
  }

}
export default Bag;
