import { EventDto } from "./EventDto";
import { Event, GameOverEvent } from "../../../domain/IncanGold"

export function toGameOverEventDto(event: Event): EventDto {
    const { winnerId, explorers } = <GameOverEvent>event;
    const explorerAndPoints = explorers.map(explorer => {
        const { explorerId, totalPoints } = explorer
        return { explorerId, totalPoints };
    })
    return GameOverEventDto(winnerId, explorerAndPoints);
}

interface ExplorerAndPoints {
    explorerId: string
    totalPoints: number
}

interface GameOverEventDto extends EventDto {
    name: 'GameOver'
    data: {
        winnerId: string;
        explorers: ExplorerAndPoints[]
    }
}

function GameOverEventDto(winnerId: string, explorers: ExplorerAndPoints[]): EventDto {
    return {
        name: 'GameOver',
        data: { winnerId, explorers }
    }
}
