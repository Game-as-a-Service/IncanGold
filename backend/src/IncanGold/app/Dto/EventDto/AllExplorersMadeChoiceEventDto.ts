import { EventDto,EventDtoTransformer } from "./EventDto"
import { Choice,Event,AllExplorersMadeChoiceEvent } from "../../../domain/IncanGold"

export class AllExplorersMadeChoiceEventTransformer extends EventDtoTransformer {
    match(event: Event): boolean {
        return (event instanceof AllExplorersMadeChoiceEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const eventDto:AllExplorersMadeChoiceEventDto = {
            name: 'AllExplorersMadeChoice',
            data: {
                explorersChoices: 
                    Object
                    .entries((<AllExplorersMadeChoiceEvent>event).allExplorersChoices)
                    .map((element)=>{
                        return {explorerId:element[0],chosen:element[1] as Choice};
                    })
            }
        }
        return eventDto;
    }
}


interface AllExplorersMadeChoiceEventDto extends EventDto{
    name: 'AllExplorersMadeChoice'
    data: {
        explorersChoices: ExplorerAndChoice[]
    }
}

interface ExplorerAndChoice {
    explorerId: string
    chosen: Choice 
}