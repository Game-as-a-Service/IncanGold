import { GameStatus, toGameStatus } from "./IncanGoldDto";
import type { EventDto } from "./EventDto";
import { eventDtoMapper } from "./EventDtoMapper";
import type { IncanGold } from "../../domain/IncanGold";
import { Event } from "../../domain/IncanGold";

export interface Output {
    game: GameStatus;
    events: EventDto[];
}

export function Output(game: IncanGold, events: Event[]): Output {
    const gameStatus = toGameStatus(game);
    const eventDtos = eventDtoMapper.execute(events);
    return Object.freeze({ game: gameStatus, events: eventDtos });
}