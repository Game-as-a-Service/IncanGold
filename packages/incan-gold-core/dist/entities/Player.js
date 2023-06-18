import Bag from "./Bag";
class Player {
    choice;
    id;
    tunnel;
    tent;
    bag;
    inTent;
    constructor(id, tent, tunnel) {
        this.choice = "keepGoing";
        this.id = id;
        this.tunnel = tunnel;
        this.tent = tent;
        tent.player = this;
        this.bag = null;
        this.inTent = false;
    }
    // 玩家總是帶著新的空背包進入通道
    enterTunnel() {
        this.inTent = false;
        this.bag = new Bag();
    }
    leaveTunnel() {
        this.inTent = true;
        this.tent.updatePoints();
    }
    leaveBag() {
        var bag = this.bag;
        this.bag = null;
        return bag;
    }
    putGemInBag(gem) {
        this.bag?.putGemIn(gem);
    }
    putInArtifactInBag(artifact) {
        this.bag?.putArtifactIn(artifact);
    }
}
export default Player;
