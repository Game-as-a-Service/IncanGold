import ArtifactCard, { artifactList } from './Card/ArtifactCard';
export default class Temple {
    artifactCards = [];
    constructor() {
        Object.entries(artifactList).forEach(pair => {
            this.artifactCards.push(new ArtifactCard(pair[0], pair[1]));
        });
    }
    drawCard() {
        return this.artifactCards.pop();
    }
}
