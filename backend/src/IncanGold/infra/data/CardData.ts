export class CardData {
    id: string;
    remainingGems: number;
    remainingArtifact: boolean;

    constructor(cardId: string, remainingGems?: number, remainingArtifact?: boolean) {
        this.id = cardId;

        this.remainingGems = (remainingGems === undefined) ? 0 : remainingGems;

        if (remainingArtifact === undefined)
            this.remainingArtifact = cardId.startsWith("A") ? true : false;
    }
}
