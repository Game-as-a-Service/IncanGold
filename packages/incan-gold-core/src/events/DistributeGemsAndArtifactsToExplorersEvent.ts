import { EventName } from "../constant/EventName";
import  Event from "./Event";
import { Choice } from "../constant/Choice"; 
import IncanGold from "../entities/IncanGold";
import TreasureCard from "../entities/Card/TreasureCard";

// 已分配寶石和神器給要離開的玩家們
export default class DistributeGemsAndArtifactsToExplorersEvent extends Event {
    public leavingExplorersID: string[]; // 離開的玩家們
    public artifactsInBag: string[] = [];   // 背包中的神器
    public numberOfGemsInLeavingExplorerBag: number;  // 背包中的寶石數
    public numberOfGemsOnCard:Record<number, number> = {}; // 通道中卡片上剩下的寶石數

    constructor(game:IncanGold){
        super(EventName.DistributeGemsAndArtifactsToExplorers);

        var leavingExplorer = game.tunnel.leavingExplorers;
        this.leavingExplorersID = leavingExplorer.map(explorer=>explorer.id);
        
        this.artifactsInBag = leavingExplorer
        .find(explorer=>explorer.bag.artifacts.length!=0)
        ?.bag.artifacts
        .map(artifacts=>artifacts.name) || [];

        this.numberOfGemsInLeavingExplorerBag = leavingExplorer[0]?.bag.numOfGems || 0;

        game.tunnel.cards.filter(card=> card instanceof TreasureCard && card.numOfGems)
        .forEach(card=>{
            let tempCard = <TreasureCard>card;
            this.numberOfGemsOnCard[tempCard.points]=tempCard.numOfGems;
        })
    }
}