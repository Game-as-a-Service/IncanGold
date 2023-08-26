import { EventDto, EventDtoTransformer } from "./EventDto";
import { Event, NewTurnHazardCardTriggeredEvent } from "../../../domain/IncanGold"

export class HazardCardEventTransformer extends EventDtoTransformer {
    match(event: Event): boolean {
        return (event instanceof NewTurnHazardCardTriggeredEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const { currentRound, currentTurn, cardName, appearsTwice } = (<NewTurnHazardCardTriggeredEvent>event);
        return NewTurnHazardCardTriggeredEventDto(currentRound, currentTurn, cardName, appearsTwice);
    }
}

interface NewTurnHazardCardTriggeredEventDto extends EventDto {
    name: 'NewTurnHazardCardTriggered';
    data: {
        currentRound: number;
        currentTurn: number;
        cardName: string;
        isAppearsTwice: boolean;
    };
}

function NewTurnHazardCardTriggeredEventDto(round: number, turn: number, cardName: string, isAppearsTwice: boolean):
    EventDto {
    return {
        name: 'NewTurnHazardCardTriggered',
        data: {
            currentRound: round,
            currentTurn: turn,
            cardName, isAppearsTwice
        }
    }
}