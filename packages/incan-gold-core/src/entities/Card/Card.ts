import Tunnel from "../Tunnel";
import Player from "../Player";

abstract class Card {
  public tunnel: Tunnel|null;

  constructor() {
    this.tunnel = null;
  }

  public abstract trigger(): void;
}

export default Card;
