import Card from "./Card";
import Tunnel from "../Tunnel";
import Player from "../Player";
import Game from "../IncanGold";
import {Event,NewTurnHazardCardTriggeredEvent} from "../../events/Event"
import Bag from "../Bag";

const hazardNames = ["fire","rocks","mummy","python","spiders"];

class HazardCard extends Card {

  public readonly name: string;
  public static counter: Record<string, number> ={} // 紀錄各種災難卡出現在通道中的次數

  constructor(name: string) {
    super();
    this.name = name;
  }

  static initializeCounter():void {
    hazardNames.forEach(name=>{
      HazardCard.counter[name] = 0;
    })
  }

  public hasExist(): boolean {
    for(let times of Object.values(HazardCard.counter)){
      if(times==2) return true;
    }
    return false;
  }

  public trigger(): Event {
    HazardCard.counter[this.name] += 1;  

    const turn = this.tunnel?.game.turn;
    const players = this.tunnel?.players || [];
    // 看現在是不是第一turn，並看通道中第一張卡是否為災難
    if(turn == 1 && this.tunnel?.cards[0] instanceof HazardCard){
      this.tunnel.game.forcedExplore = true; // 更改遊戲的狀態，影響遊戲寄出的選擇
    }else{
      // 重複的話就把玩家趕離通道
      if(this.hasExist()){
        players.forEach(player=>{
          var bag = player.leaveBag();
          if(bag) this.tunnel?.bags.push(bag);
          player.leaveTunnel()
        })
      }
    }

    const event:NewTurnHazardCardTriggeredEvent = {
      name:'NewTurnHazardCardTriggered',
      data:{
          currentTurn: turn||1,
          cardName : this.name,
          forcePlayersToLeave : this.hasExist(),
      }
    }
    return event;
  }

}

export default HazardCard;

export { hazardNames };
