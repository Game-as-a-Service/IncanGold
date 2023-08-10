import Event from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

// 幾號玩家已做出選擇
export class PlayerMadeChoiceEvent extends Event{
    public readonly playerWhoMadeChoice:string; 

    constructor(playerID:string){
        super(EventName.PlayerMadeChoice);
        this.playerWhoMadeChoice = playerID;
    }
}

// 通道中所有玩家皆已做出選擇
export class AllPlayersMadeChoiceEvent extends Event{
    public allPlayersChoices: Record<string, string> = {};

    constructor(game:IncanGold){
        super(EventName.AllPlayersMadeChoice);
        game.playersInTunnel.forEach(player=>{
            this.allPlayersChoices[player.id] = player.choice;
        })
    }
}