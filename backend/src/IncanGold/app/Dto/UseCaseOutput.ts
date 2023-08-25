import { GameStatus } from "./IncanGoldDto";
import { EventDto } from "./EventDto/EventDto";

export interface Output {
    game: GameStatus;
    events: EventDto[];
}

export function Output(game: GameStatus, events: EventDto[]): Output {
    return Object.freeze({ game, events });
}