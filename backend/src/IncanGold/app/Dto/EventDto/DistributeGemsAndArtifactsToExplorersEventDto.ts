import { EventDto,EventDtoTransformer } from "./EventDto"
import { Event,DistributeGemsAndArtifactsToExplorersEvent } from "../../../domain/IncanGold"

export class DistributeGemsAndArtifactsToExplorersEventTransformer extends EventDtoTransformer{
    match(event: Event): boolean {
        return (event instanceof DistributeGemsAndArtifactsToExplorersEvent);
    }

    transformToEventDto(event: Event): EventDto {
        const e = <DistributeGemsAndArtifactsToExplorersEvent>event;
        const eventDto:DistributeGemsAndArtifactsToExplorersEventDto = {
            name: 'DistributeGemsAndArtifactsToExplorers',
            data: {
                explorers: {
                    explorerId: e.leavingExplorersID,
                    numberOfGemsInBag : e.numberOfGemsInLeavingExplorerBag,
                    artifactsInBag : e.artifactsInBag
                }
            }
        }
        return eventDto;
    }
}

interface DistributeGemsAndArtifactsToExplorersEventDto extends EventDto
{
    name: 'DistributeGemsAndArtifactsToExplorers'
    data: {
        explorers: ExplorerAndResource
    }
}

interface ExplorerAndResource {
    explorerId: string[]
    numberOfGemsInBag : number
    artifactsInBag : string[]
}