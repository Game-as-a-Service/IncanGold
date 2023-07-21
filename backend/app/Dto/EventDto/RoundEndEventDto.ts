import Event from "../../../../packages/incan-gold-core/src/domain/events/Event"
import RoundEndEvent from "../../../../packages/incan-gold-core/src/domain/events/RoundEndEvent"
import { EventDto,EventDtoTransformer } from "./EventDto"

export class RoundEndEventTransformer extends EventDtoTransformer {
    match(event: Event): boolean {
        return (event instanceof RoundEndEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const e = (<RoundEndEvent>event);
        const eventDto:RoundEndEventDto = {
            name: 'RoundEnd',
            data: {
                removedCards: e.discardedCardsID
            }
        }
        return eventDto;
    }
}


interface RoundEndEventDto extends EventDto {
    name: 'RoundEnd'
    data: {
        removedCards: string[]
    }
}