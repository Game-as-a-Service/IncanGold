import Card from "./Card";
import IncanGold from "../IncanGold";
import Event from "../../events/Event"
import Artifact from "../Artifact";
import {NewTurnArtifactCardTriggeredEvent} from "../../events/NewTurnCardTriggeredEvent"


export const artifactName:Record<number,string> = { 1:'杯子',2:'雞蛋糕模具',3:'金輪',4:'派大星',5:'黑暗大法師'};
export const artifactPoints:Record<number,number> = { 1:5,2:7,3:8,4:10,5:12 };


export default class ArtifactCard extends Card {

  public readonly name : string;
  public readonly points : number;
  public artifact : Artifact;
  public isArtifactPresent : boolean;

  constructor(cardID:string, name:string,points:number) {
    super(cardID);
    this.name = name;
    this.points = points;
    this.artifact = new Artifact(name,points);
    this.isArtifactPresent = true;
  }
  
  public trigger(game:IncanGold): Event {
    return new NewTurnArtifactCardTriggeredEvent(game);
  }

  public giveArtifact(): Artifact {
    this.isArtifactPresent = false;
    return this.artifact;
  }

}
