import { Event, RoundEndEvent } from "../../../domain/IncanGold"
import { EventDto } from "./EventDto"

export function toRoundEndEventDto(event: Event): EventDto {
    const { discardedCardsId } = <RoundEndEvent>event;
    return RoundEndEventDto(discardedCardsId);
}

interface RoundEndEventDto extends EventDto {
    name: 'RoundEnd'
    data: {
        removedCards: string[]
    }
}

function RoundEndEventDto(removedCards: string[]): EventDto {
    return {
        name: 'RoundEnd',
        data: { removedCards }
    }
}