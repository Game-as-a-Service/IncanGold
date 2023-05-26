import Tunnel from "../Tunnel";
import Player from "../Player";
import {Event} from "../../events/Event"


abstract class Card {
  public tunnel: Tunnel|null;

  constructor() {
    this.tunnel = null;
  }

  public abstract trigger(): Event;
}

export default Card;
