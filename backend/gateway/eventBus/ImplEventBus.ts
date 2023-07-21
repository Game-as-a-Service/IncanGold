import EventBus from "../../app/EventBus";
import Event from "../../../packages/incan-gold-core/src/domain/events/Event";

export default class ImplEventBus extends EventBus {
  broadcast(events:Event[]) {
    // TODO: should implement
    events.forEach((event) => {
      console.log(event);
    });
  }
}
