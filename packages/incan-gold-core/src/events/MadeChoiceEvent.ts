import Event from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

// 幾號玩家已做出選擇
export class ExplorerMadeChoiceEvent extends Event{
    public readonly explorerWhoMadeChoice:string; 

    constructor(explorerID:string){
        super(EventName.ExplorerMadeChoice);
        this.explorerWhoMadeChoice = explorerID;
    }
}

// 通道中所有玩家皆已做出選擇
export class AllExplorersMadeChoiceEvent extends Event{
    public allExplorersChoices: Record<string, string> = {};

    constructor(game:IncanGold){
        super(EventName.AllExplorersMadeChoice);
        game.explorersInTunnel.forEach(explorer=>{
            this.allExplorersChoices[explorer.id] = explorer.choice;
        })
    }
}