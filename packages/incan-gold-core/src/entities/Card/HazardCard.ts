import Card from "./Card";
import Explorer from "../Explorer";
import IncanGold from "../IncanGold";
import { Event } from "../../events/Event"
import { NewTurnHazardCardTriggeredEvent } from "../../events/NewTurnCardTriggeredEvent"
import { hazardCards } from "../../constant/CardInfo";

export default class HazardCard extends Card {

  public readonly name: string;

  constructor(id: string) {
    super(id);
    this.name = hazardCards[id];
  }

  public trigger(game: IncanGold): Event {
    const isHazardCardDuplicated = game.tunnel.isHazardCardDuplicated;

    // first turn, first card is hazardCard
    if (game.turn == 1 && game.tunnel.cards[0] instanceof HazardCard) {
      game.forceExplore = true;
    }

    // 災難重複出現，就把玩家趕離通道
    if (isHazardCardDuplicated) {
      game.explorersInTunnel.forEach(explorer => {
        explorer.clearBag()
        explorer.leaveTunnel();
      });
    }

    return NewTurnHazardCardTriggeredEvent(game, isHazardCardDuplicated);
  }

}

