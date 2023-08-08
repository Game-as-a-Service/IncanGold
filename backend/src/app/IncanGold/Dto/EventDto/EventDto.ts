import Event from "domain/incan-gold-core/src/domain/events/Event"; 

export abstract class EventDtoTransformer {
    abstract match(event:Event):boolean;
    abstract transformToEventDto(event:Event):EventDto;

    handleEvent(event:Event):EventDto|void{
        if(this.match(event))
            return this.transformToEventDto(event);
        else
            return;
    }
}

export interface EventDto {
    name : string
    data : any
}