import { Event } from "../domain/event/Event";

export interface IEventDispatcher{
    dispatch(events: Event[]): void;
}