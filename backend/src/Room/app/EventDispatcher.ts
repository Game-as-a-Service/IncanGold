import { Event } from "../domain/event/Event";

export interface IEventDispatcher{
    dispatch(event: Event): void;
}