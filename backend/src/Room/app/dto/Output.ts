import { RoomDto } from "./RoomDto";
import { Event } from "../../domain/event/Event";

export interface Output {
    room: RoomDto;
    events: Event[];
}

export function Output(room: RoomDto, events: Event[]): Output {
    return Object.freeze({ room, events });
}