import ArtifactCard from "./Card/ArtifactCard";
import HazardCard from "./Card/HazardCard";
import TreasureCard from "./Card/TreasureCard";
class Tunnel {
    players = [];
    cards = [];
    bags = [];
    game;
    constructor(game) {
        this.game = game;
    }
    appendCard(card) {
        this.cards.push(card);
    }
    existNoPlayers() {
        for (let player of this.players)
            if (!player.inTent)
                return false;
        return true;
    }
    remove() {
        // 1.移除背包
        this.bags.splice(0, this.bags.length);
        // 2.移除寶物卡上的寶石
        for (let card of this.cards) {
            if (card instanceof TreasureCard)
                card.clear();
        }
    }
    discardInto(trashDeck) {
        // 丟棄所有神器卡
        var tmpCards = [];
        this.cards.forEach((card) => {
            if (card instanceof ArtifactCard) {
                trashDeck.appendCard(card);
                card.tunnel = null;
            }
            else
                tmpCards.push(card);
        });
        this.cards = tmpCards;
        // 災難卡放入廢棄排堆
        var index = 0;
        for (let [name, times] of HazardCard.counter.entries()) {
            if (times == 2) {
                var hazardCard = this.cards.find(card => {
                    index++;
                    return ((card instanceof HazardCard) && (card.name == name));
                });
                if (hazardCard) {
                    trashDeck.appendCard(hazardCard);
                    hazardCard.tunnel = null;
                }
                this.cards.splice(index, 1);
                break;
            }
        }
    }
}
export default Tunnel;
