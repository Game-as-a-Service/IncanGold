import { EventDto,EventDtoTransformer } from "./EventDto";
import { Event,PlayerMadeChoiceEvent } from "../../../domain/IncanGold"


export class PlayerMadeChoiceEventTransformer extends EventDtoTransformer{
    match(event:Event): boolean {
        return (event instanceof PlayerMadeChoiceEvent);
    }

    transformToEventDto(event:Event):EventDto {
        const eventDto:PlayerMadeChoiceEventDto = {
            name: 'PlayerMadeChoice',
            data:{
                playerWhoMadeChoice:(<PlayerMadeChoiceEvent>event).playerWhoMadeChoice
            }
        }
        return eventDto;
    }
}


interface PlayerMadeChoiceEventDto extends EventDto {
    name: 'PlayerMadeChoice';
    data: {
        playerWhoMadeChoice: string;
    };
}