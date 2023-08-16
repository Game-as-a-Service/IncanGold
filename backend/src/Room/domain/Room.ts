import { Player } from "./Player";
import { Event } from "./event/Event";
import { Seat } from "./Seat";
import { STATE } from "./constant/State";
import { s } from "vitest/dist/types-198fd1d9";

type PlayerId = string;

export class Room {
    public id: string;
    public name: string;
    public password: string | undefined = undefined;
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

    get availableSeats(): number {
        let count = 0;
        this.seats.forEach(seat => {
            count += Number(seat.isAvailable)
        });
        return count;
    }

    get isPrivate(): boolean {
        return (!!this.password);
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

    sitDown(playerId: string, seatNumber?: number) {
        const player = this.getPlayerById(playerId);

        if (!seatNumber) {
            for (let [key, seat] of this.seats.entries()) {
                if (seat.isAvailable) {
                    seat.playerId = playerId;
                    player.state = STATE.NOTREADY;
                    break;
                }
            }
        } else {
            if (this.seats.get(seatNumber).isAvailable) {
                this.seats.get(seatNumber).playerId = playerId;
                player.state = STATE.NOTREADY;
            }
        }
    }

    *joinRoom(playerId: PlayerId, password: string) {
        if (this.password !== null && this.password !== password) {
            return this.makeEvent('joinRoomFailed', null);
        }

        this.players.push(new Player(playerId));
        this.sitDown(playerId)
        yield this.makeEvent('joinRoom', { playerId, roomId: this.id });

        if (this.seatedPlayerCount === 1)
            return yield this.setHost(playerId);
    }

    setHost(playerId: PlayerId) {
        if (this.getPlayerById(playerId)) {
            this.host = playerId;
            return this.makeEvent('newHost', { host: playerId, roomId: this.id });
        }
    }

    private makeEvent(type: string, data: any) {
        const event: Event = { type, data };
        return event;
    }

    private getPlayerById(playerId: string) {
        const player = this.players.find(p => p.id === playerId);
        if (!player)
            throw new Error('Player not found');
        return player;
    }
}