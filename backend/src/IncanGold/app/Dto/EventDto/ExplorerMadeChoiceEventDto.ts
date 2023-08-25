import { EventDto,EventDtoTransformer } from "./EventDto";
import { Event,ExplorerMadeChoiceEvent } from "../../../domain/IncanGold"


export class ExplorerMadeChoiceEventTransformer extends EventDtoTransformer{
    match(event:Event): boolean {
        return (event instanceof ExplorerMadeChoiceEvent);
    }

    transformToEventDto(event:Event):EventDto {
        const eventDto:ExplorerMadeChoiceEventDto = {
            name: 'ExplorerMadeChoice',
            data:{
                explorerWhoMadeChoice:(<ExplorerMadeChoiceEvent>event).explorerWhoMadeChoice
            }
        }
        return eventDto;
    }
}


interface ExplorerMadeChoiceEventDto extends EventDto {
    name: 'ExplorerMadeChoice';
    data: {
        explorerWhoMadeChoice: string;
    };
}