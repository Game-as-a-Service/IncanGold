import { EventDto,EventDtoTransformer } from "./EventDto"
import { Choice,Event,AllPlayersMadeChoiceEvent } from "../../../../domain/IncanGold"

export class AllPlayersMadeChoiceEventTransformer extends EventDtoTransformer {
    match(event: Event): boolean {
        return (event instanceof AllPlayersMadeChoiceEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const eventDto:AllPlayersMadeChoiceEventDto = {
            name: 'AllPlayersMadeChoice',
            data: {
                playersChoices: 
                    Object
                    .entries((<AllPlayersMadeChoiceEvent>event).allPlayersChoices)
                    .map((element)=>{
                        return {playerId:element[0],chosen:element[1] as Choice};
                    })
            }
        }
        return eventDto;
    }
}


interface AllPlayersMadeChoiceEventDto extends EventDto{
    name: 'AllPlayersMadeChoice'
    data: {
        playersChoices: PlayerAndChoice[]
    }
}

interface PlayerAndChoice {
    playerId: string
    chosen: Choice 
}