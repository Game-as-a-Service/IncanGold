import { RoomData } from "./RoomData";
import { SeatData } from "./SeatData";
import { Room } from "../domain/Room";
import { Seat } from "../domain/Seat";

export class RoomMapper {

    toDomain(roomData: RoomData): Room {
        const seats = new Map<number, Seat>();
        roomData.seats.forEach(seatData => {
            const { position, locked, playerId, state } = seatData
            seats.set(position, new Seat(locked, playerId, state));
        })

        const { id, name, hostId, passwd } = roomData
        return new Room(id, name, hostId, passwd, seats);
    }

    updateRoomData(room: Room, roomData: RoomData) {
        roomData.id = room.id;
        roomData.name = room.name;
        roomData.hostId = room.host;
        roomData.passwd = room.password;

        roomData.seats.forEach(seat => {
            const { locked, playerId, state } = room.seats.get(seat.position);
            seat.modify(locked, playerId, state);
        })
    }

}