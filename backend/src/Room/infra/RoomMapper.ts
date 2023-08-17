import { RoomData } from "./RoomData";
import { PlayerData } from "./PlayerData";
import { Room } from "../domain/Room";
import { Player } from "../domain/Player";
import { Seat } from "../domain/Seat";

export class RoomMapper {

    toDomain(roomData: RoomData): Room {
        const seats = new Map<number, Seat>();
        [1, 2, 3, 4, 5, 6, 7, 8].forEach(index => {
            const { locked, playerId} = roomData.seats[index];
            seats.set(
                index,
                new Seat(locked,playerId)
            );
        });

        const players = [];
        roomData.players.forEach(playerData => {
            players.push(new Player(playerData.id, playerData.state))
        });

        return new Room(
            roomData.id,
            roomData.name,
            roomData.hostId,
            roomData.passwd,
            players,
            seats
        );
    }

    updateRoomData(room: Room, roomData: RoomData) {
        roomData.id = room.id;
        roomData.name = room.name;
        roomData.hostId = room.host;
        roomData.passwd = room.password;

        room.seats.forEach((seat, key) => {
            roomData.seats[key] = seat;
        });

        let players:PlayerData[] = [];
        room.players.forEach(player => {
            const playerData = new PlayerData();
            playerData.id = player.id;
            playerData.state = player.state;
            playerData.room = roomData;
            players.push(playerData);
        })

        roomData.players = players;
    }

}