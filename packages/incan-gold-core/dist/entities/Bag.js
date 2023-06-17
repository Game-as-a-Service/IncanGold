class Bag {
    points;
    artifactCards;
    gems;
    constructor() {
        this.points = 0;
        this.artifactCards = [];
        this.gems = [];
    }
    putGemIn(gem) {
        this.gems.push(gem);
        this.points += gem.points;
    }
    putArtifactIn(artifact) {
        this.artifactCards.push(artifact);
        artifact.tunnel = null;
        this.points += artifact.points;
    }
}
export default Bag;
