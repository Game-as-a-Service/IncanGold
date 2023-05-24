import Card from "./Card";
export const hazardNames = ["fire", "rocks", "mummy", "python", "spiders"];
class HazardCard extends Card {
    name;
    static counter; // 紀錄各種災難卡出現在通道中的次數
    constructor(name) {
        super();
        this.name = name;
    }
    static initializeCounter() {
        HazardCard.counter = new Map();
        hazardNames.forEach(name => {
            HazardCard.counter.set(name, 0);
        });
    }
    hasExist() {
        for (let times of HazardCard.counter.values()) {
            if (times == 2)
                return true;
        }
        return false;
    }
    trigger() {
        HazardCard.counter.set(this.name, HazardCard.counter.get(this.name) || 0 + 1);
        // 看現在是不是第一turn，並看通道中第一張卡是否為災難
        if (this.tunnel?.game.turn == 1 && this.tunnel.cards[0] instanceof HazardCard) {
            this.tunnel.game.forcedExplore = true; // 更改遊戲的狀態，影響遊戲寄出的選擇
        }
        else {
            // 重複的話就把玩家趕離通道
            if (this.hasExist()) {
                var players = this.tunnel?.players;
                if (players)
                    players.forEach(player => {
                        var bag = player.leaveBag();
                        if (bag)
                            this.tunnel?.bags.push(bag);
                        player.leaveTunnel();
                    });
            }
        }
    }
}
export default HazardCard;
