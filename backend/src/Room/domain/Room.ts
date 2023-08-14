import { Player } from "./Player";
import { Event } from "./event/Event";
import { Seat } from "./Seat";
import { STATE } from "./constant/State";

type PlayerId = string;

export class Room {
    public id: string;
    public name: string;
    public password: string;
    public host: PlayerId;
    public players: Player[];
    public seats: Map<number, Seat>;

    constructor(id: string, name: string, host: PlayerId, password: string,
        players: Player[], seats: Map<number, Seat>) {
        this.id = id;
        this.name = name;
        this.host = host;
        this.password = password;
        this.players = players;
        this.seats = seats;
    }


    setHost(playerId: PlayerId) {
        if (this.players.find(player => player.id == playerId))
            this.host = playerId;
    }

    get availableSeats(): number {
        let unlockedSeats = 8;
        this.seats.forEach(seat => {
            unlockedSeats -= Number(seat.locked)
        });
        return unlockedSeats;
    }

    get isPrivate(): boolean {
        return false;
    }

    get seatedPlayerCount(): number {
        let count = 0;
        this.seats.forEach(seat => { count += Number(seat.playerId !== null) })
        return count;
    }

    get allReady(): boolean {
        const notReadyPlayers = this.players.filter(p => p.state === STATE.NOTREADY);
        return notReadyPlayers.length === 0;
    }

    get canStartGame(): boolean {
        return (this.seatedPlayerCount >= 3 && this.allReady);
    }



    static create(roomId:string ,name: string, playerId: PlayerId, password: string) {
        const room = new Room(roomId, name, playerId, password, [new Player(playerId,STATE.NOTREADY)], new Map<number, Seat>());
        room.seats.set(1, { locked: false, playerId: playerId });

        const event: Event = {
            type: 'roomCreated',
            data: { 
                host: playerId, 
                roomId: room.id,
            }
        }
        return { room, event };
    }

}