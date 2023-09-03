import { Event } from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";
import TreasureCard from "../entities/Card/TreasureCard";
import HazardCard from "../entities/Card/HazardCard";
import ArtifactCard from "../entities/Card/ArtifactCard";

// 新回合已開始，且放入通道中的寶物卡已觸發效果
export interface NewTurnTreasureCardTriggeredEvent {
    name:EventName.NewTurnTreasureCardTriggered,
    data:{
        round: number, 
        turn: number, 
        points: number, 
        numberOfGemsOnCard: number, 
        numberOfGemsInBag: number
    }
}

export function NewTurnTreasureCardTriggeredEvent(game: IncanGold): Event {
    const name = EventName.NewTurnTreasureCardTriggered;

    const { round, turn, explorersInTunnel, tunnel } = game
    const { points, numOfGems: numberOfGemsOnCard } = tunnel.lastCard as TreasureCard
    const { numOfGems: numberOfGemsInBag } = explorersInTunnel[0].bag;

    const data = { round, turn, points, numberOfGemsOnCard, numberOfGemsInBag }
    return Event(name, data);
}

// 新回合已開始，且放入通道中的災難卡已觸發效果
export interface NewTurnHazardCardTriggeredEvent {
    name:EventName.NewTurnHazardCardTriggered,
    data:{
        round: number, 
        turn: number, 
        cardId: string, 
        appearsTwice: boolean, 
    }
}

export function NewTurnHazardCardTriggeredEvent(game: IncanGold, appearsTwice: boolean): Event {
    const name = EventName.NewTurnHazardCardTriggered;

    const { round, turn, tunnel } = game
    const { id: cardId } = tunnel.lastCard;

    const data = { round, turn, cardId, appearsTwice }
    return Event(name, data);
}

// 新回合已開始，且放入通道中的神器卡已觸發效果
export interface NewTurnArtifactCardTriggeredEvent {
    name:EventName.NewTurnArtifactCardTriggered,
    data:{
        round: number, 
        turn: number, 
        cardId: string, 
    }
}

export function NewTurnArtifactCardTriggeredEvent(game: IncanGold): Event {
    const name = EventName.NewTurnArtifactCardTriggered;

    const { round, turn, tunnel } = game;
    const { id: cardId } = tunnel.lastCard;

    const data = { round, turn, cardId }
    return Event(name, data);
}