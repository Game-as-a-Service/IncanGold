import { GameStatus, toGameStatus } from "./IncanGoldDto";
import { eventFilter } from "./EventFilter";
import type { IncanGold } from "../../domain/IncanGold";
import { Event } from "../../domain/IncanGold";

export interface Output {
    game: GameStatus;
    events: Event[];
}

export function Output(game: IncanGold, events: Event[]): Output {
    const gameStatus = toGameStatus(game);
    const eventDtos = eventFilter.execute(events);
    return Object.freeze({ game: gameStatus, events: eventDtos });
}