import { Choice } from "../constant/Choice";
import Tent from "./Tent";
import Bag from "./Bag";
import Gem from "./Gem";
import Artifact from "./Artifact";

export default class Explorer {
  public id: string;
  public choice: Choice;
  public inTent: boolean = true;
  public bag: Bag;
  public tent: Tent;

  constructor(id: string, choice?: Choice, inTent?: boolean, bag?: Bag, tent?: Tent) {
    this.id = id;
    this.choice = choice === undefined ? Choice.NotSelected : choice;
    this.inTent = inTent === undefined ? true : inTent;
    this.bag = bag === undefined ? new Bag() : bag;
    this.tent = tent === undefined ? new Tent() : tent;
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

  get numOfArtifacts(): number {
    return this.tent.artifacts.length;
  }

  get points(): number {
    return this.tent.points;
  }

}
