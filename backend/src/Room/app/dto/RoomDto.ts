import { Room } from "../../domain/Room";
import { Seat } from "../../domain/Seat";

export function flattenToDto(room: Room): RoomDto {
    const roomDto: RoomDto = {
        id: room.id,
        name: room.name,
        unlockedSeats: room.unlockedSeats,
        host: room.host,
        isPrivate: room.isPrivate,
        seats: {},
        canStartGame: room.canStartGame,
    }
    const seats = [...room.seats.entries()];
    seats.forEach(([key, seat]) => {
        roomDto.seats[key] = seat;
    });
    return roomDto;
}

export interface RoomDto {
    id: string;
    name: string;
    unlockedSeats: number;
    host: string; // playerId
    isPrivate: boolean; // private room
    seats: Record<number, Seat>
    canStartGame: boolean;
}

export function flattenToDtoForListRooms(room: Room) {
    const { id, name, unlockedSeats, seatedPlayerCount,
        host, isPrivate, state: roomStats, canStartGame } = room;
    const roomDto = {
        id, name, unlockedSeats, seatedPlayerCount,
        host, isPrivate, roomStats, canStartGame,
    }
    return roomDto;
}