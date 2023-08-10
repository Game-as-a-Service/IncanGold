import { Choice } from "../constant/Choice";
import Tent from "./Tent";
import Bag from "./Bag";
import Gem from "./Gem";
import Artifact from "./Artifact";

export default class Player {
  public id: string;
  public choice: Choice = Choice.NotSelected;
  public inTent: boolean = true;
  public bag: Bag = new Bag();
  public tent: Tent = new Tent();
  
  constructor(id: string) {
    this.id = id;
  }

  public enterTunnel(): void {
    this.choice = Choice.NotSelected;
    this.inTent = false;
  }

  public leaveTunnel(): void {
    this.inTent = true;
    this.tent.update(this.bag);
    this.clearBag();  
  }

  public clearBag(): void {
    this.bag = new Bag();  
  }

  public putGemsInBag(gems: Gem[]): void {
    this.bag.putGemsIn(gems);
  }

  public putInArtifactsInBag(artifacts: Artifact[]): void {
    this.bag.putArtifactsIn(artifacts);
  }

  get numOfArtifacts():number{
    return this.tent.artifacts.length;
  }

  get points():number{
    return this.tent.points;
  }

}
