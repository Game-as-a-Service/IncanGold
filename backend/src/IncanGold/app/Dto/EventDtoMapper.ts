import { EventDto } from "./EventDto/EventDto";
import { toExplorerMadeChoiceEventDto } from "./EventDto/ExplorerMadeChoiceEventDto";
import { toAllExplorersMadeChoiceEventDto } from "./EventDto/AllExplorersMadeChoiceEventDto";
import { toDistributeGemsAndArtifactsToExplorersEventDto } from "./EventDto/DistributeGemsAndArtifactsToExplorersEventDto";
import { toGameOverEventDto } from "./EventDto/GameOverEventDto";
import { toNewTurnHazardCardTriggeredEventDto } from "./EventDto/NewTurnHazardCardTriggeredEventDto";
import { toRoundEndEventDto } from "./EventDto/RoundEndEventDto";
import { Event } from "../../domain/IncanGold";

class EventDtoMapper {

    public filter(event: Event): EventDto | null {
        if (event.name === 'AllExplorersMadeChoice')
            return toAllExplorersMadeChoiceEventDto(event);
        if (event.name === 'DistributeGemsAndArtifactsToExplorers')
            return toDistributeGemsAndArtifactsToExplorersEventDto(event);
        if (event.name === 'ExplorerMadeChoice')
            return toExplorerMadeChoiceEventDto(event);
        if (event.name === 'GameOver')
            return toGameOverEventDto(event);
        if (event.name === 'NewTurnHazardCardTriggered')
            return toNewTurnHazardCardTriggeredEventDto(event);
        if (event.name === 'RoundEnd')
            return toRoundEndEventDto(event);
        return null;
    }

    public execute(events: Event[]): EventDto[] {
        return events
            .map(event => this.filter(event))
            .filter(event => !!event);
    }
}

const eventDtoMapper = new EventDtoMapper();
export { eventDtoMapper };
