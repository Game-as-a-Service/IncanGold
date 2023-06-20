import Card from "./Card";
export const artifactList = { "黑暗大法師": 12, "派大星": 10, "金輪": 8, "雞蛋糕模具": 7, "杯子": 5 };
class ArtifactCard extends Card {
    name;
    points;
    constructor(name, points) {
        super();
        this.name = name;
        this.points = points;
    }
    trigger() { }
}
export default ArtifactCard;
