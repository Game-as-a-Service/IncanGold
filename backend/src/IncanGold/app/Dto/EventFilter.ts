import { Event, EventName } from "../../domain/IncanGold";

class EventFilter {

    private eventNames = [
        EventName.AllExplorersMadeChoice,
        EventName.DistributeGemsAndArtifactsToExplorers,
        EventName.ExplorerMadeChoice,
        EventName.GameOver,
        EventName.NewTurnHazardCardTriggered,
        EventName.RoundEnd,
        EventName.Error
    ]

    public filter(event: Event): Event | null {
        if (this.eventNames.includes(event.name))
            return event;
        return null;
    }

    public execute(events: Event[]): Event[] {
        return events
            .map(event => this.filter(event))
            .filter(event => !!event);
    }
}

const eventFilter = new EventFilter();
export { eventFilter };
