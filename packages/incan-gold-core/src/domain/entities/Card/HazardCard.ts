import Card from "./Card";
import Player from "../Player";
import IncanGold from "../IncanGold"; 
import Event from "../../events/Event"
import {NewTurnHazardCardTriggeredEvent} from "../../events/NewTurnCardTriggeredEvent"

export const hazardNames = ["fire","rocks","mummy","python","spiders"];

export default class HazardCard extends Card {

  public readonly name: string;

  constructor(cardID:string, name: string) {
    super(cardID);
    this.name = name;
  }

  public appearsTwice(game:IncanGold): boolean {
    return !!(Object.values(game.hazardCardCounter).find(times=>(times===2)));
  }

  public trigger(game:IncanGold): Event {
    game.hazardCardCounter[this.name] += 1 ;  

    // first turn, first card is hazardCard
    if(game.turn == 1 && game.tunnel.cards[0] instanceof HazardCard){
      game.forceExplore = true; 
    }
    
    // 災難重複出現，就把玩家趕離通道
    if(this.appearsTwice(game)){
      game.playersInTunnel.forEach(player=>{
        player.clearBag()
        player.leaveTunnel();
      });
    }
    
    return new NewTurnHazardCardTriggeredEvent(game,this.appearsTwice(game));
  }

}

