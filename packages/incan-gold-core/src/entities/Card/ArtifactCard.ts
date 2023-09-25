import Card from "./Card";
import IncanGold from "../IncanGold";
import { Event } from "../../events/Event"
import Artifact from "../Artifact";
import { artifactCards } from "../../constant/CardInfo";
import { NewTurnArtifactCardTriggeredEvent } from "../../events/NewTurnCardTriggeredEvent"

export default class ArtifactCard extends Card {

  public readonly name: string;
  public readonly points: number;
  public artifact: Artifact | null = null;
  public isArtifactPresent: boolean;

  constructor(id: string, isArtifactPresent: boolean = true) {
    super(id);
    const { name, points } = artifactCards[id];
    this.name = name;
    this.points = points;
    this.isArtifactPresent = isArtifactPresent;
    this.artifact = isArtifactPresent ? new Artifact(id, name, points) : null;
  }

  public trigger(game: IncanGold): Event {
    return NewTurnArtifactCardTriggeredEvent(game);
  }

  public giveArtifact(): Artifact {
    this.isArtifactPresent = false;
    if (this.artifact) return this.artifact;
    throw new Error("Artifact is not present");
  }

}
