import { EventDto,EventDtoTransformer } from "./EventDto";
import GameOverEvent from "../../../../packages/incan-gold-core/src/domain/events/GameOverEvent";
import Event from "../../../../packages/incan-gold-core/src/domain/events/Event";

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
                players: e.players.map((elem)=>{
                    return {playerId:elem.playerID, totalPoints:elem.totalPoints};
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
        players: PlayerAndPoints[]
    }
}

interface PlayerAndPoints {
    playerId: string
    totalPoints:number
}