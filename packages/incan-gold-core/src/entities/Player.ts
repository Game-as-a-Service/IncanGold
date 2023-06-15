import Tunnel from "./Tunnel";
import Tent from "./Tent";
import Bag from "./Bag";
import Gem from "./Gem";
import ArtifactCard from "./Card/ArtifactCard";

enum Choice {
  NotSelected = "notSelected",
  KeepGoing = "keepGoing",
  Quit = "quit",
}

class Player {
  public choice: string;
  public id: number;
  public tunnel: Tunnel;
  public tent: Tent;
  public bag: Bag | null;
  public inTent:boolean;
  

  constructor(id: number, tent: Tent, tunnel : Tunnel) {
    this.choice = Choice.NotSelected;
    this.id = id;
    this.tunnel = tunnel;
    this.tent = tent;
    tent.player = this;
    this.bag = null;
    this.inTent = false;
  }

  // 玩家總是帶著新的空背包進入通道
  public enterTunnel(): void {
    this.choice = Choice.NotSelected;
    this.inTent = false;
    this.bag = new Bag();
  }

  public leaveTunnel(): void {
    this.inTent = true;
    this.tent.updatePoints();
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

export {Choice};
