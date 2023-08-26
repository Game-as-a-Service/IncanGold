import { EventDto } from "./EventDto";
import { Event, ExplorerMadeChoiceEvent } from "../../../domain/IncanGold"

export function toExplorerMadeChoiceEventDto(event: Event): EventDto {
    const {explorerWhoMadeChoice} = <ExplorerMadeChoiceEvent>event;
    return ExplorerMadeChoiceEventDto(explorerWhoMadeChoice);
}

interface ExplorerMadeChoiceEventDto extends EventDto {
    name: 'ExplorerMadeChoice';
    data: {
        explorerWhoMadeChoice: string;
    };
}

function ExplorerMadeChoiceEventDto(explorerWhoMadeChoice: string): EventDto {
    return {
        name: 'ExplorerMadeChoice',
        data: { explorerWhoMadeChoice }
    }
}