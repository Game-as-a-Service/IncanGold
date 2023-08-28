import { EventDto } from "./EventDto";
import { Event, EventName } from "../../domain/IncanGold";

class EventDtoMapper {

    private eventNames = [
        EventName.AllExplorersMadeChoice,
        EventName.DistributeGemsAndArtifactsToExplorers,
        EventName.ExplorerMadeChoice,
        EventName.GameOver,
        EventName.NewTurnHazardCardTriggered,
        EventName.RoundEnd,
        EventName.Error
    ]

    public filter(event: Event): EventDto | null {
        if (this.eventNames.includes(event.name))
            return event;
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
