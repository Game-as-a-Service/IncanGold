import { EventDto, EventDtoTransformer } from "./EventDto/EventDto";
import { AllPlayersMadeChoiceEventTransformer } from "./EventDto/AllPlayersMadeChoiceEventDto";
import { DistributeGemsAndArtifactsToPlayersEventTransformer } from "./EventDto/DistributeGemsAndArtifactsToPlayersEventDto";
import { GameoverEventTransformer } from "./EventDto/GameoverEventDto";
import { HazardCardEventTransformer } from "./EventDto/NewTurnHazardCardTriggeredEventDto";
import { RoundEndEventTransformer } from "./EventDto/RoundEndEventDto";
import Event from "../../../packages/incan-gold-core/src/domain/events/Event";

export class TransformEventsToEventDtos {
    private _transformers:EventDtoTransformer[];

    constructor(){
        this._transformers = [
            new AllPlayersMadeChoiceEventTransformer(),
            new DistributeGemsAndArtifactsToPlayersEventTransformer(),
            new GameoverEventTransformer(),
            new HazardCardEventTransformer(),
            new RoundEndEventTransformer()
        ];
    }

    public transform(event:Event):EventDto|void {
        for(const transformer of this._transformers){
            const eventDto = transformer.handleEvent(event);
            if(eventDto) return eventDto;
        }
    }

    public execute(events:Event[]):EventDto[] {
        const eventDtos:EventDto[] = [];
        
        events.forEach(event => {
            const eventDto = this.transform(event);
            if(eventDto) eventDtos.push(eventDto);
        })

        return eventDtos;
    }
}

const transformEventsToEventDtos = new TransformEventsToEventDtos();
export { transformEventsToEventDtos };