import { EventDto,EventDtoTransformer } from "./EventDto";
import GameoverEvent from "../../../../packages/incan-gold-core/src/domain/events/GameoverEvent";
import Event from "../../../../packages/incan-gold-core/src/domain/events/Event";

export class GameoverEventTransformer extends EventDtoTransformer {
    match(event: Event): boolean {
        return (event instanceof GameoverEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const e = <GameoverEvent>event;
        const eventDto:GameoverEventDto = {
            name: 'Gameover',
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


interface GameoverEventDto extends EventDto
{
    name: 'Gameover'
    data: {
        winnerID:string;
        players: PlayerAndPoints[]
    }
}

interface PlayerAndPoints {
    playerId: string
    totalPoints:number
}