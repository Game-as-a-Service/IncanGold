import Tunnel from "./Tunnel";
import Bag from "./Bag";
import Gem from "./Gem";
import ArtifactCard from "./Card/ArtifactCard";

export enum Choice {
  NotSelected = "notSelected",
  KeepGoing = "keepGoing",
  Quit = "quit",
}

export default class Player {
  public id: number;
  public choice: Choice = Choice.NotSelected;
  public inTent: boolean = true;
  public points: number = 0;
  public bag: Bag = new Bag();
  public artifacts: ArtifactCard[] = [];
  
  constructor(id: number) {
    this.id = id;
  }

  public enterTunnel(): void {
    this.choice = Choice.NotSelected;
    this.inTent = false;
  }

  public leaveTunnel(): void {
    this.inTent = true;
    this.points += this.bag.points;
    this.artifacts = this.artifacts.concat(this.bag.artifactCards);
    this.clearBag();  
  }

  public clearBag(): void {
    this.bag = new Bag();  
  }

  public putGemsInBag(gems: Gem[]): void {
    this.bag.putGemsIn(gems);
  }

  public putInArtifactsInBag(artifacts: ArtifactCard[]): void {
    this.bag.putArtifactsIn(artifacts);
  }
}

