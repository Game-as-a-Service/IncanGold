import { EventDto,EventDtoTransformer } from "./EventDto";
import { Event,GameOverEvent } from "../../../domain/IncanGold"

export class GameOverEventTransformer extends EventDtoTransformer {
    match(event: Event): boolean {
        return (event instanceof GameOverEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const e = <GameOverEvent>event;
        const eventDto:GameOverEventDto = {
            name: 'GameOver',
            data: {
                winnerID: e.winnerID,
                explorers: e.explorers.map((elem)=>{
                    return {explorerId:elem.explorerID, totalPoints:elem.totalPoints};
                })
            }
        }
        return eventDto;
    }
}


interface GameOverEventDto extends EventDto
{
    name: 'GameOver'
    data: {
        winnerID:string;
        explorers: ExplorerAndPoints[]
    }
}

interface ExplorerAndPoints {
    explorerId: string
    totalPoints:number
}