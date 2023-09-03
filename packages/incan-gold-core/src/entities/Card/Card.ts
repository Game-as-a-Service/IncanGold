import IncanGold from "../IncanGold";
import { Event } from "../../events/Event"

export default abstract class Card {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  public abstract trigger(game: IncanGold): Event;
}
