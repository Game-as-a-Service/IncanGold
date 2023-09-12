import { flattenToDto, RoomDto } from "./RoomDto";
import type { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";

export interface Output {
    room: RoomDto;
    events: Event[];
}

export function Output(room: Room, events: Event[]): Output {
    const roomDto = flattenToDto(room);
    return Object.freeze({ room: roomDto, events });
}