import { IncanGold, TreasureCard, HazardCard, ArtifactCard, Explorer }
    from '../../../../src/IncanGold/domain/IncanGold';
import { noShuffle } from './NoShuffle';

export function putCardInTunnel(cardsId: string[], game: IncanGold) {
    const { tunnel } = game;
    cardsId.forEach(id => {
        tunnel.appendCard(newCard(id));
        tunnel.lastCard.trigger(game);
    });
}

function newCard(id: string) {
    switch (id[0]) {
        case "T": return new TreasureCard(id);
        case "A": return new ArtifactCard(id);
        case "H": return new HazardCard(id);
        default: throw new Error("Invalid card id");
    }
}

export function setupIncanGold(id: string, round: number, turn: number, explorersId: string[]) {
    const explorers = explorersId.map(id => new Explorer(id));
    const game = new IncanGold(id, round, turn, explorers);
    noShuffle(game);
    game.makeExplorersEnterTunnel();
    return game;
}

export function showTunnel(game: IncanGold) {
    let output = "Tunnel's cards: ";
    let cards = game.tunnel.cards.map(card => {
        if (card instanceof TreasureCard) return "[T: " + card.numOfGems + '/' + card.points + "]";
        if (card instanceof HazardCard) return "[H: " + card.name + "]";
        if (card instanceof ArtifactCard) return "[A: " + card.name + "]";
    }) + "\n";
    output = output.concat(cards);
    console.log(output);
}