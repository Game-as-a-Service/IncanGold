import IncanGold from "../IncanGold";
import Event from "../../events/Event"

export default abstract class Card {
  public abstract trigger(game:IncanGold): Event;
}

