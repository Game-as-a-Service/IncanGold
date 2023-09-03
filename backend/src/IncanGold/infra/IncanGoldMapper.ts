import { IncanGoldData } from "./data/IncanGoldData";
import { ExplorerData } from "./data/ExplorerData";
import { CardData } from "./data/CardData";
import { IncanGold, Explorer, Gem, Artifact, Card, TreasureCard, ArtifactCard, HazardCard, CardInfo, Tent, Bag } from "../domain/IncanGold"
import { TrashDeck } from "../../../../packages/incan-gold-core/src/entities/Deck";
const { artifactCards, hazardCards } = CardInfo;

export class IncanGoldMapper {

    toDomain(incanGoldData: IncanGoldData): IncanGold {
        const { id, round, turn, explorers: explorerData } = incanGoldData;
        const { deck: deckData, tunnel: tunnelData, trashDeck: trashDeckData } = incanGoldData
        const explorers = explorerData.map(e => this.toExplorer(e));
        const deck = deckData.map(cardData => this.toCard(cardData));
        const tunnel = tunnelData.map(cardData => this.toCard(cardData));
        const trashDeck = this.setupTrashDeck(trashDeckData);
        return new IncanGold(id, round, turn, explorers, tunnel, deck, trashDeck);
    }

    private toExplorer(explorer: ExplorerData) {
        const { id, choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts } = explorer;
        const tent = this.setupTent(totalPoints, gemsInTent, artifacts);
        return new Explorer(id, choice, inTent, new Bag(gemsInBag), tent);
    }

    private setupTent(totalPoints: number, gemsInTent: number, artifactIDs: string[]) {
        const artifacts = artifactIDs.map(id => {
            const { name, points } = artifactCards[id];
            return new Artifact(name, points);
        });
        return new Tent(totalPoints, gemsInTent, artifacts);
    }

    private setupTrashDeck(trashDeckData: Record<number, CardData[]>) {
        const trashDeck = new Map<number, Card[]>();
        [...Object.entries(trashDeckData)].forEach(([key, cards]) => {
            trashDeck.set(Number(key), cards.map(cardData => this.toCard(cardData)));
        });
        return trashDeck;
    }

    // data -> card
    private toCard(cardData: CardData): Card {
        const { id } = cardData;
        switch (id[0]) {
            case 'T':
                const { remainingGems } = cardData;
                return new TreasureCard(id, remainingGems);
            case "A":
                const { remainingArtifact } = cardData;
                return new ArtifactCard(id, remainingArtifact);
            case "H":
                return new HazardCard(id);
        }
    }

    toData(game: IncanGold): IncanGoldData {
        const { gameId, round, turn, explorers, tunnel, deck, trashDeck } = game;
        const explorersData = explorers.map(e => this.toExplorerData(e));
        const tunnelData = tunnel.cards.map(c => this.toCardData(c));
        const deckData = deck.cards.map(c => this.toCardData(c));
        const trashDeckData = this.toTrashDeckData(trashDeck);
        return IncanGoldData.generateBy(gameId, round, turn, tunnelData, deckData, trashDeckData, explorersData);
    }

    private toExplorerData(explorer: Explorer): ExplorerData {
        const { id, choice, inTent, bag, tent } = explorer
        const gemsInBag = bag.numOfGems;
        const gemsInTent = tent.numOfGems;
        const totalPoints = tent.points;
        const artifacts = tent.artifactsNames;
        return ExplorerData.generateBy(id, choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts)
    }

    private toTrashDeckData(trashDeck: TrashDeck) {
        const trashDeckData: Record<number, CardData[]> = {};
        [...trashDeck.cards.entries()].forEach(element => {
            const [round, cards] = [element[0], element[1]];
            trashDeckData[round] = cards.map(c => this.toCardData(c));
        })
        return trashDeckData;
    }

    // card -> cardData
    private toCardData(card: Card): CardData {
        const { id } = card;
        switch (id[0]) {
            case 'T':
                const { numOfGems } = (<TreasureCard>card);
                return new CardData(id, numOfGems);
            case "A":
                const { isArtifactPresent } = (<ArtifactCard>card);
                return new CardData(id, 0, isArtifactPresent);
            case "H":
                return new CardData(id);
        }
    }

}

