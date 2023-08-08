import { EventDto } from "./EventDto";
import Event from "domain/incan-gold-core/src/domain/events/Event";
import { NewTurnHazardCardTriggeredEvent } from "domain/incan-gold-core/src/domain/events/NewTurnCardTriggeredEvent";
import { EventDtoTransformer } from "./EventDto";

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