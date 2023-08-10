import { EventDto,EventDtoTransformer } from "./EventDto";
import { Event,NewTurnHazardCardTriggeredEvent } from "../../../../domain/IncanGold"

export class HazardCardEventTransformer extends EventDtoTransformer{
    match(event:Event): boolean {
        return (event instanceof NewTurnHazardCardTriggeredEvent);
    }

    transformToEventDto(event:Event):EventDto {
        const eventDto:NewTurnHazardCardTriggeredEventDto = {
            name: 'NewTurnHazardCardTriggered',
            data:{
                isAppearsTwice:(<NewTurnHazardCardTriggeredEvent>event).appearsTwice
            }
        }
        return eventDto;
    }
}

interface NewTurnHazardCardTriggeredEventDto extends EventDto {
    name: 'NewTurnHazardCardTriggered';
    data: {
        isAppearsTwice: boolean;
    };
}