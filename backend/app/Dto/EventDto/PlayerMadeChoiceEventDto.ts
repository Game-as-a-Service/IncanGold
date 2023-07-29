import { EventDto,EventDtoTransformer } from "./EventDto";
import Event from "../../../../packages/incan-gold-core/src/domain/events/Event";
import { PlayerMadeChoiceEvent } from "../../../../packages/incan-gold-core/src/domain/events/MadeChoiceEvent";


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