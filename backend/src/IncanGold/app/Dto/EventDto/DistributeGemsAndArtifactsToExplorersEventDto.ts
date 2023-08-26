import { EventDto } from "./EventDto"
import { Event, DistributeGemsAndArtifactsToExplorersEvent } from "../../../domain/IncanGold"

export function toDistributeGemsAndArtifactsToExplorersEventDto(event: Event): EventDto {
    const { leavingExplorersID, numberOfGemsInLeavingExplorerBag, artifactsInBag }
        = <DistributeGemsAndArtifactsToExplorersEvent>event;

    return DistributeGemsAndArtifactsToExplorersEventDto(
        leavingExplorersID, numberOfGemsInLeavingExplorerBag, artifactsInBag
    )
}

interface DistributeGemsAndArtifactsToExplorersEventDto extends EventDto {
    name: 'DistributeGemsAndArtifactsToExplorers'
    data: {
        leavingExplorersId: string[]
        numberOfGemsInBag: number
        artifactsInBag: string[]
    }
}

function DistributeGemsAndArtifactsToExplorersEventDto
    (leavingExplorersId: string[], numberOfGemsInBag: number, artifactsInBag: string[])
    : DistributeGemsAndArtifactsToExplorersEventDto {
    return {
        name: 'DistributeGemsAndArtifactsToExplorers',
        data: { leavingExplorersId, numberOfGemsInBag, artifactsInBag }
    }
}
