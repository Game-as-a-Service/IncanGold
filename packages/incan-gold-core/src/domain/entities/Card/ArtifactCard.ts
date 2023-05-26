import Card from "./Card";
import Tunnel from "../Tunnel";
import {Event,NewTurnArtifactCardTriggeredEvent} from "../../events/Event"

const artifactList =  {"黑暗大法師":12,"派大星":10,"金輪":8,"雞蛋糕模具":7,"杯子":5};

class ArtifactCard extends Card {

  public readonly name : string;
  public readonly points : number;

  constructor(name:string,points:number) {
    super();
    this.name = name;
    this.points = points;
  }
  
  public trigger(): Event {
    const turn = this.tunnel?.game.turn;
    const players = this.tunnel?.players || [];
    const event:NewTurnArtifactCardTriggeredEvent = {
      name:'NewTurnArtifactCardTriggered',
      data:{
          currentTurn: turn||1,
          cardName : this.name,
          cardPoints : this.points,
      }
    }
    
    return event;
  }
}

export default ArtifactCard;

export {artifactList};
