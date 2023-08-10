import { EventDto,EventDtoTransformer } from "./EventDto"
import { Event,DistributeGemsAndArtifactsToPlayersEvent } from "../../../../domain/IncanGold"

export class DistributeGemsAndArtifactsToPlayersEventTransformer extends EventDtoTransformer{
    match(event: Event): boolean {
        return (event instanceof DistributeGemsAndArtifactsToPlayersEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const e = <DistributeGemsAndArtifactsToPlayersEvent>event;
        const eventDto:DistributeGemsAndArtifactsToPlayersEventDto = {
            name: 'DistributeGemsAndArtifactsToPlayers',
            data: {
                players: {
                    playerId: e.leavingplayersID,
                    numberOfGemsInBag : e.numberOfGemsInLeavingplayersBag,
                    artifactsInBag : e.artifactsInBag
                }
            }
        }
        return eventDto;
    }
}

interface DistributeGemsAndArtifactsToPlayersEventDto extends EventDto
{
    name: 'DistributeGemsAndArtifactsToPlayers'
    data: {
        players: PlayerAndResource
    }
}

interface PlayerAndResource {
    playerId: string[]
    numberOfGemsInBag : number
    artifactsInBag : string[]
}