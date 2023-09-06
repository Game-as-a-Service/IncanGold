import { Event } from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

export interface ExplorerMadeChoiceEvent extends Event {
    name: EventName.ExplorerMadeChoice,
    data: {
        explorerWhoMadeChoice: string;
    }
}

export function ExplorerMadeChoiceEvent(explorerId: string): Event {
    const name = EventName.ExplorerMadeChoice
    const explorerWhoMadeChoice = explorerId;
    return { name, data: { explorerWhoMadeChoice } };
}

export interface AllExplorersMadeChoiceEvent extends Event {
    name: EventName.AllExplorersMadeChoice,
    data: {
        allExplorersChoices: Record<string, string>;
    }
}

export function AllExplorersMadeChoiceEvent(game: IncanGold): Event {
    const name = EventName.AllExplorersMadeChoice;

    const allExplorersChoices: Record<string, string> = {};
    game.explorersInTunnel.forEach(explorer => {
        const { id, choice } = explorer;
        allExplorersChoices[id] = choice;
    });

    return Event(name, { allExplorersChoices });
}