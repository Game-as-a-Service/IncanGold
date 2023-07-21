import Event from '../../packages/incan-gold-core/src/domain/events/Event';
import { EventName } from '../../packages/incan-gold-core/src/domain/constant/EventName';

export default abstract class EventBus {
  protected eventMap: Map<EventName, Event[]> = new Map();

  /*
    public on(eventName: EventName, callback: Function) {
        const callbacks = this.eventMap.get(eventName) || [];
        callbacks.push(callback);
        this.eventMap.set(eventName, callbacks);
    }
    public emit(eventName: EventName, data: any) {
        const callbacks = this.eventMap.get(eventName);
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }
  */ 

  abstract broadcast(events: Event[]): void ;
}