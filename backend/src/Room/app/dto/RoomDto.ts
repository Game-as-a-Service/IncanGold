import { Room } from "../../domain/Room";
import { Seat } from "../../domain/Seat";

export function flattenToDto(room:Room):RoomDto{
    const RoomDto:RoomDto = {
        id:room.id,
        name:room.name,
        unlockedSeats:room.unlockedSeats,
        host:room.host,
        isPrivate:room.isPrivate,
        seats:{},
        canStartGame:room.canStartGame,
    }
    const seats = [...room.seats.entries()];
    seats.forEach(([key, seat]) => {
        RoomDto.seats[key] = seat; 
    });
    return RoomDto;
}

export interface RoomDto{
    id:string;
    name:string;
    unlockedSeats:number;
    host:string; // playerId
    isPrivate:boolean; // private room
    seats: Record<number, Seat> 
    canStartGame:boolean;
}

