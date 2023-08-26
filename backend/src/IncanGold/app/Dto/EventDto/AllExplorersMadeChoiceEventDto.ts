import { EventDto } from "./EventDto"
import { Choice, Event, AllExplorersMadeChoiceEvent } from "../../../domain/IncanGold"

export function toAllExplorersMadeChoiceEventDto(event: Event): EventDto {
    const allExplorersChoices = Object
        .entries((<AllExplorersMadeChoiceEvent>event).allExplorersChoices)
        .map(([explorerId, chosen]) => {
            return { explorerId, chosen: <Choice>chosen };
        });

    return AllExplorersMadeChoiceEventDto(allExplorersChoices);
}

interface ExplorerAndChoice {
    explorerId: string
    chosen: Choice
}

interface AllExplorersMadeChoiceEventDto extends EventDto {
    name: 'AllExplorersMadeChoice'
    data: {
        explorersChoices: ExplorerAndChoice[]
    }
}

function AllExplorersMadeChoiceEventDto(explorersChoices: ExplorerAndChoice[]): EventDto {
    return {
        name: 'AllExplorersMadeChoice',
        data: { explorersChoices }
    }
}
