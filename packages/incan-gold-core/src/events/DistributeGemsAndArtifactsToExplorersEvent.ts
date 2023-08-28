import { EventName } from "../constant/EventName";
import { Event } from "./Event";
import { Choice } from "../constant/Choice";
import type IncanGold from "../entities/IncanGold";
import TreasureCard from "../entities/Card/TreasureCard";
import type Card from "../entities/Card/Card";
import type Explorer from "../entities/Explorer";

export interface DistributeGemsAndArtifactsToExplorersEvent extends Event {
    name: EventName.DistributeGemsAndArtifactsToExplorers,
    data: {
        leavingExplorerIds: string[],
        artifactsInBag: string[],
        gemsInBag: number,
        numberOfGemsOnCard: Record<string, number>,
    }
}

export function DistributeGemsAndArtifactsToExplorersEvent(game: IncanGold): Event {
    const name = EventName.DistributeGemsAndArtifactsToExplorers;

    const { leavingExplorers, cards } = game.tunnel;
    const leavingExplorerIds = getIds(leavingExplorers);
    const artifactsInBag = getArtifactsInBag(leavingExplorers);
    const gemsInBag = getGemsInBag(leavingExplorers);
    const numberOfGemsOnCard = getNumberOfGemsOnCard(cards);

    const data = { leavingExplorerIds, artifactsInBag, gemsInBag, numberOfGemsOnCard }
    return Event(name, data);
}


function getIds(leavingExplorers: Explorer[]) {
    return leavingExplorers.map(explorer => explorer.id);
}

function getGemsInBag(leavingExplorers: Explorer[]) {
    return !!leavingExplorers.length
        ? leavingExplorers[0].bag.numOfGems
        : 0;
}

function getArtifactsInBag(leavingExplorers: Explorer[]) {
    return leavingExplorers.length === 1
        ? leavingExplorers[0].bag.artifacts.map(artifact => artifact.name)
        : [];
}

function getNumberOfGemsOnCard(cards: Card[]): Record<number, number> {
    let numberOfGemsOnCard: Record<string, number> = {};
    cards.filter(card => card instanceof TreasureCard)
        .forEach(card => {
            const { id, numOfGems } = <TreasureCard>card;
            numberOfGemsOnCard[id] = numOfGems;
        });
    return numberOfGemsOnCard;
}