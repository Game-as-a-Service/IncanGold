import Card from "./Card";
import IncanGold from "../IncanGold";
import Event from "../../events/Event"
import Artifact from "../Artifact";
import {NewTurnArtifactCardTriggeredEvent} from "../../events/NewTurnCardTriggeredEvent"

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
