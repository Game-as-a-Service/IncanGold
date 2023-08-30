import { Event } from "./Event";
import { EventName } from "../constant/EventName";
import IncanGold from "../entities/IncanGold";

interface ExplorerAndPoints {
    id: string,
    totalPoints: number
}

function ExplorerAndPoints(id: string, totalPoints: number): ExplorerAndPoints {
    return { id, totalPoints };
}

export interface GameOverEvent extends Event {
    name: EventName.GameOver,
    data: {
        winnerId: string,
        explorers: ExplorerAndPoints[],
    }
}

export function GameOverEvent(game: IncanGold): Event {
    const name = EventName.GameOver;

    const winnerId = game.winnerId ?? "none(draw)";

    const explorers = [...game.explorers]
        .sort((e1, e2) => e2.points - e1.points)
        .map(({ id, points }) => ExplorerAndPoints(id, points))

    return Event(name, { winnerId, explorers })
}
