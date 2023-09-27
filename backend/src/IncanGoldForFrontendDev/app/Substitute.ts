import { Card, IncanGold, TreasureCard, HazardCard, ArtifactCard } from "../../IncanGold/domain/IncanGold";

export function substitute(
    incanGold: IncanGold,
    hasShuffle: boolean = false,
    hasArtifactCard: boolean = false,
    cardIds: string[] = null
) {
    const { gameId, deck } = incanGold;
    let { cards: deckCards } = deck;

    if (!recorder.has(gameId)) // 紀錄該場遊戲是否洗牌、插入神器卡
        recorder.set(gameId, { hasShuffle, hasArtifactCard });

    if (cardIds !== undefined && cardIds.length > 0) { // 指定自定義牌[*]
        deckCards = generateCards(cardIds);
        incanGold.deck.cards = deckCards;
    }

    const { hasShuffle: s, hasArtifactCard: a } = recorder.get(gameId);
    incanGold.addArtifactCardAndShuffleDeck = new_addArtifactCardAndShuffleDeck(s, a)
}

function generateCards(cardIds: string[]): Card[] {
    return cardIds.map(id => generateCard(id)).reverse();
}

function generateCard(id: string): Card {
    switch (id[0]) {
        case 'T':
            return new TreasureCard(id);
        case "A":
            return new ArtifactCard(id);
        case "H":
            return new HazardCard(id);
    }
}

interface setting {
    hasShuffle: boolean,
    hasArtifactCard: boolean
}
type gameId = string;

const recorder: Map<gameId, setting> = new Map();


function new_addArtifactCardAndShuffleDeck(hasShuffle: boolean, hasArtifactCard: boolean) {
    return function addArtifactCardAndShuffleDeck(): void {
        if (hasArtifactCard) {
            const cardId = "A" + this.round;
            this.deck.appendCard(new ArtifactCard(cardId));
        }
        if (hasShuffle)
            this.deck.shuffle();
    }
}
