import { EventName } from "../constant/EventName";
import  Event from "./Event";
import { Choice } from "../constant/Choice"; 
import IncanGold from "../entities/IncanGold";
import TreasureCard from "../entities/Card/TreasureCard";

// 已分配寶石和神器給要離開的玩家們
export default class DistributeGemsAndArtifactsToPlayersEvent extends Event {
    public leavingplayersID: string[]; // 離開的玩家們
    public artifactsInBag: string[] = [];   // 背包中的神器
    public numberOfGemsInLeavingplayersBag: number;  // 背包中的寶石數
    public numberOfGemsOnCard:Record<number, number> = {}; // 通道中卡片上剩下的寶石數

    constructor(game:IncanGold){
        super(EventName.DistributeGemsAndArtifactsToPlayers);

        var leavingPlayers = game.tunnel.leavingPlayers;
        this.leavingplayersID = leavingPlayers.map(player=>player.id);
        
        this.artifactsInBag = leavingPlayers
        .find(player=>player.bag.artifacts.length!=0)
        ?.bag.artifacts
        .map(artifacts=>artifacts.name) || [];

        this.numberOfGemsInLeavingplayersBag = leavingPlayers[0]?.bag.numOfGems || 0;

        game.tunnel.cards.filter(card=> card instanceof TreasureCard && card.numOfGems)
        .forEach(card=>{
            let tempCard = <TreasureCard>card;
            this.numberOfGemsOnCard[tempCard.points]=tempCard.numOfGems;
        })
    }
}