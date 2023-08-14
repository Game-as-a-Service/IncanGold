import { Player } from "../../domain/Player";
import { Room } from "../../domain/Room";
import { Seat } from "../../domain/Seat";

export function flattenToDto(room:Room):RoomDto{
    const RoomDto:RoomDto = {
        id:room.id,
        name:room.name,
        availableSeats:room.availableSeats,
        host:room.host,
        isPrivate:room.isPrivate,
        seats:room.seats,
        players:room.players,
        canStartGame:room.canStartGame,
    }
    return RoomDto;
}

export interface RoomDto{
    id:string;
    name:string;
    availableSeats:number;
    host:string; // playerId
    isPrivate:boolean; // private room
    seats: Map<number,Seat>;
    players:Player[];
    canStartGame:boolean;
}

