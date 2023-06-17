import Card from "./Card";
import Gem from "../Gem";
class TresasureCard extends Card {
    points;
    gems;
    constructor(points) {
        super();
        this.points = points;
        this.gems = [];
    }
    generateGems() {
        for (let i = 0; i < this.points; i++) {
            this.gems.push(new Gem());
        }
    }
    devideGemsTo(players) {
        // iterations:分配次數
        var iterations = Math.floor(this.gems.length / players.length);
        for (let i = 0; i < iterations; i++) {
            players.forEach(player => {
                let gem = this.gems.pop();
                if (gem)
                    player.putGemInBag(gem);
            });
        }
    }
    trigger() {
        this.generateGems();
        var players = this.tunnel?.players.filter(player => player.inTent === false);
        if (players)
            this.devideGemsTo(players);
    }
    clear() {
        this.gems.splice(0, this.gems.length);
    }
}
export default TresasureCard;
