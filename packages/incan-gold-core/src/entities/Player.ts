import Tunnel from "./Tunnel";
import Tent from "./Tent";
import Bag from "./Bag";
import Gem from "./Gem";
import ArtifactCard from "./Card/ArtifactCard";

class Player {
  public choice: string;
  public id: number;
  public tunnel: Tunnel;
  public tent: Tent;
  public bag: Bag | null;
  

  constructor(id: number, tent: Tent, tunnel : Tunnel) {
    this.choice = "keepGoing";
    this.id = id;
    this.tunnel = tunnel;
    this.tent = tent;
    tent.player = this;
    this.bag = null;
  }

  // 玩家總是帶著新的空背包進入通道
  public enterTunnel(): void {
    this.tunnel.players.push(this);
    this.bag = new Bag();
  }

  public leaveTunnel(): void {
    var index = this.tunnel?.players.indexOf(this);
    if(index) this.tunnel?.players.splice(index,1);
    this.tent.updatePoints();
    if(this.tunnel?.players.length==0)
      throw new Error("通道沒人囉～");
  }

  public leaveBag(): Bag|null {
    var bag = this.bag;
    this.bag = null;
    return bag;
  }

  public putGemInBag(gem: Gem): void {
    this.bag?.putGemIn(gem);
  }

  public putInArtifactInBag(artifact: ArtifactCard): void {
    this.bag?.putArtifactIn(artifact);
  }
}

export default Player;
