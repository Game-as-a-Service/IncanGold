import { Room } from "../../domain/Room";
import { Seat } from "../../domain/Seat";

export function flattenToDto(room: Room): RoomDto {
    const { id, name, unlockedSeats, host, isPrivate, canStartGame, state: roomStatus } = room;
    const roomDto: RoomDto = {
        id, name, unlockedSeats, host, isPrivate, canStartGame, roomStatus,
        seats: {}
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
    seats: Record<number, Seat>;
    canStartGame: boolean;
    roomStatus: string;
}

export function flattenToDtoForListRooms(room: Room) {
    const { id, name, unlockedSeats, seatedPlayerCount,
        host, isPrivate, state: roomStatus, canStartGame } = room;
    const roomDto = {
        id, name, unlockedSeats, seatedPlayerCount,
        host, isPrivate, roomStatus, canStartGame,
    }
    return roomDto;
}