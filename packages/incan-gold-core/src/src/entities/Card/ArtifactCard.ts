import Card from "./Card";
import Tunnel from "../Tunnel";

const artifactList =  {"黑暗大法師":12,"派大星":10,"金輪":8,"雞蛋糕模具":7,"杯子":5};

class ArtifactCard extends Card {

  public readonly name : string;
  public readonly points : number;

  constructor(name:string,points:number) {
    super();
    this.name = name;
    this.points = points;
  }
  
  public trigger(): void {}
}

let a = new ArtifactCard("11",10);

export default ArtifactCard;

export {artifactList};
