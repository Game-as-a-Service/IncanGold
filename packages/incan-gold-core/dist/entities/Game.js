import Temple from "./Temple";
import ArtifactCard from "./Card/ArtifactCard";
import TreasureCard from "./Card/TreasureCard";
import HazardCard from "./Card/HazardCard";
import { TrashDeck, Deck } from "./Deck";
import Tunnel from "./Tunnel";
import Player from "./Player";
import Tent from "./Tent";
import Gem from "./Gem";
class Game {
    temple;
    deck;
    trashDeck;
    tunnel;
    tents = [];
    players = [];
    forcedExplore = false;
    round = 0;
    turn = 0;
    winnerID = 0;
    constructor() {
        this.tunnel = new Tunnel(this);
        this.temple = new Temple();
        this.deck = new Deck();
        this.trashDeck = new TrashDeck();
    }
    // 配置有幾位玩家
    setPlayerCount(num) {
        for (let i = 1; i <= num; i++) {
            this.tents.push(new Tent(i));
            this.players.push(new Player(i, this.tents[i - 1], this.tunnel));
        }
        this.tunnel.players = this.players;
    }
    devideAllGems(players) {
        let sum = 0; // 總寶石數
        let record = new Map(); // 備份每張寶物卡有多少顆寶石
        let tempCards = Array.from(this.tunnel.cards);
        for (let card of tempCards.reverse()) {
            if (card instanceof TreasureCard) {
                sum += card.gems.length;
                record.set(card, card.gems.length);
                card.clear();
            }
        }
        let eachOneCanGet = Math.floor(sum / players.length); // 離開的玩家各可以拿幾顆
        let left = sum - eachOneCanGet * (players.length); // 最後會剩下的寶石數
        for (let player of players) {
            for (var i = 0; i < eachOneCanGet; i++)
                player.putGemInBag(new Gem());
        }
        for (let i = left; i > 0;) {
            for (let [card, nums] of record) {
                for (let j = 1; j <= nums; j++) {
                    card.gems.push(new Gem());
                    if ((--i) == 0)
                        break;
                }
                if (i == 0)
                    break;
            }
        }
    }
    getAndGo() {
        // 即將離開通道的玩家
        var leavingPlayers = this.players.filter(player => player.choice == "quit");
        if (leavingPlayers.length != 0) {
            // 分寶石給要離開的玩家
            this.devideAllGems(leavingPlayers);
            // 分神器給要離開的玩家
            if (leavingPlayers.length == 1) {
                var artifacts = this.tunnel.cards.filter(card => (card instanceof ArtifactCard));
                artifacts.forEach(artifact => { leavingPlayers[0].putInArtifactInBag(artifact); });
            }
            // 讓這些玩家離開通道   
            for (let player of leavingPlayers)
                player.leaveTunnel();
        }
    }
    // 從牌堆抽牌放入通道
    putCardInTunnel() {
        var card = this.deck.drawCard();
        if (card) {
            this.tunnel.appendCard(card);
            card.tunnel = this.tunnel;
        }
    }
    // 把通道中的牌放回牌堆
    putCardsInDeck() {
        this.tunnel.cards.forEach(card => {
            this.deck.appendCard(card);
            card.tunnel = null; // 卡片已不在通道內
        });
        this.tunnel.cards.splice(0);
    }
    // 找到贏家，記錄起來
    findWinner() {
        var maxPoints = 0;
        this.tents.forEach((tent) => {
            if (tent.points >= maxPoints) {
                maxPoints = tent.points;
                this.winnerID = tent.id;
            }
        });
    }
    onRoundStart() {
        this.round++;
        this.turn = 0;
        HazardCard.initializeCounter(); // 重新計算災難卡的出現次數
        var artifact = this.temple.drawCard();
        if (artifact)
            this.deck.appendCard(artifact);
        this.deck.shuffle();
        this.players.forEach(player => player.enterTunnel());
    }
    onRoundEnd() {
        this.tunnel.discardInto(this.trashDeck);
        this.tunnel.remove();
    }
    onTurnStart() {
        this.turn++; // 當前回合的turn數 +1
        this.putCardInTunnel(); // 把卡放進通道內
        this.tunnel.cards[this.tunnel.cards.length - 1].trigger(); // 觸發被放入通道的卡片效果
    }
}
export default Game;
