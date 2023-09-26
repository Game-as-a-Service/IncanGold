import { Card, IncanGold, TreasureCard, HazardCard, ArtifactCard }
    from "../../../../src/IncanGold/domain/IncanGold";

export function noShuffle(incanGold: IncanGold,) {
    incanGold.addArtifactCardAndShuffleDeck = () => { };
}
