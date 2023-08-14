import { RoomData } from "./RoomData";
import { PlayerData } from "./PlayerData";
import { Room } from "../domain/Room";
import { Player } from "../domain/Player";
import { Seat } from "../domain/Seat";

export class RoomMapper {

    toDomain(roomData: RoomData): Room {
        const seats = new Map<number, Seat>();
        const arr = [1,2,3,4,5,6,7,8];
        arr.forEach(index => {
            seats.set(index , {
                locked: roomData.seats[index].locked,
                playerId: roomData.seats[index].playerId,
            });
        });

        const players = roomData.players.
            map(playerData => new Player(playerData.id, playerData.state));

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

        console.log('roomMapper updateRoomData 34');
        console.log(room.seats);
        room.seats.forEach((seat, key) => {
            roomData.seats[key] = {
                locked: seat.locked,
                playerId: seat.playerId
            };
        });
        console.log(roomData.seats);

        console.log('roomMapper updateRoomData 42');
        let players = [];
        room.players.forEach(player => {
            const playerData = new PlayerData();
            playerData.id = player.id;
            playerData.state = player.state;
            players.push(playerData);
        })

        console.log('roomMapper updateRoomData 51');
        roomData.id = room.id;
        roomData.name = room.name;
        roomData.hostId = room.host;
        roomData.passwd = room.password;
        roomData.players = players;
    }

    createRoomData(room: Room): RoomData {
        console.log("roomMapper createRoomData 57");
        const roomData = new RoomData();
        roomData.seats = {};
        console.log("roomMapper createRoomData 59");
        this.updateRoomData(room, roomData);
        console.log("roomMapper createRoomData 61");
        return roomData;
    }

}