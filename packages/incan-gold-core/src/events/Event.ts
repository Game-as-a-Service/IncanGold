import { EventName } from "../constant/EventName";

export interface Event {
    name: EventName,
    data: any;
}

export function Event(name: EventName, data: any): Event {
    return { name, data };
}