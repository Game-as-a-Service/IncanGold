import { Event } from "./event/Event";
import { Seat } from "./Seat";
import { ROOMSTATE, STATE } from "./constant/State";

type PlayerId = string;

export class Room {
    public id: string;
    public state: ROOMSTATE;
    public name: string;
    public password: string | undefined = undefined;
    public host: PlayerId;
    public seats: Map<number, Seat>;

    constructor(id: string, state: ROOMSTATE, name: string, host: PlayerId, password: string, seats: Map<number, Seat>) {
        this.id = id;
        this.state = state;
        this.name = name;
        this.host = host;
        this.password = password;
        this.seats = seats;
    }

    // Get number of available seats
    get unlockedSeats(): number {
        return [...this.seats.values()].filter(seat => seat.locked === false).length;
    }

    // Check if room is private
    get isPrivate(): boolean {
        return (!!this.password);
    }

    // Get number of seated players
    get seatedPlayerCount(): number {
        return [...this.seats.values()].filter(seat => seat.playerId !== null).length;
    }

    // Check if all players are ready
    get allReady(): boolean {
        return !([...this.seats.values()].filter(p => p.state === STATE.NOTREADY).length);
    }

    // Check if game can be started
    get canStartGame(): boolean {
        return (
            this.state === ROOMSTATE.WAITING &&
            this.seatedPlayerCount >= 3 &&
            this.allReady
        );
    }

    startGame() {
        if (this.canStartGame) {
            this.state = ROOMSTATE.INGAME;
            const playerIds = [...this.seats.values()]
                .filter(p => !!p.playerId)
                .map(p => p.playerId);
            return this.makeEvent('startGame', { playerIds, roomId: this.id });
        } else
            return this.makeEvent("can't StartGame", null);
    }


    sitDown(playerId: string, seatNumber?: number): boolean {
        let seat: Seat;
        if (!seatNumber)
            seat = [...this.seats.values()].find(s => s.isAvailable);
        else
            seat = this.seats.get(seatNumber).isAvailable ?
                this.seats.get(seatNumber) : undefined;

        if (seat) seat.sitDown(playerId);
        return (!!seat);
    }

    *joinRoom(playerId: PlayerId, password: string) {
        if (this.validate(password))
            return this.makeEvent('joinRoomFailed', null);

        const seated = (this.state === ROOMSTATE.WAITING) ?
            this.sitDown(playerId) : false;
        yield this.makeEvent('joinRoom', { playerId, seated, roomId: this.id });

        if (this.seatedPlayerCount === 1)
            return yield this.setHost(playerId);
    }

    *leaveRoom(playerId: PlayerId) {
        // Vacate the seat occupied by the leaving player
        const seatedOriginally = this.vacateSeat(playerId);

        yield this.makeEvent('leaveRoom', { playerId, seatedOriginally, roomId: this.id });

        // If leaving player was host, assign new host 
        if (this.host === playerId)
            yield this.setHost(this.getSeatedPlayer.playerId);
    }

    setHost(playerId: PlayerId) {
        if (this.playerIsSeated(playerId)) {
            this.host = playerId;
            return this.makeEvent('newHost', { host: playerId });
        }
    }

    setPassword(password: string) {
        this.password = password;
        return this.makeEvent('password was set', null);
    }

    setName(name: string) {
        this.name = name;
        return this.makeEvent('name was changed', { name });
    }

    *ready(playerId: PlayerId) {
        const seat = [...this.seats.values()].find(s => s.playerId === playerId);
        seat.ready();
        yield this.makeEvent('playerReady', { playerId });
        if (this.canStartGame) yield this.makeEvent('canStartGame', null);
    }

    *cancelReady(playerId: PlayerId) {
        const seat = [...this.seats.values()].find(s => s.playerId === playerId);
        seat.cancelReady();
        yield this.makeEvent('playerCancelReady', { playerId });
    }

    lockSeat(position: number) {
        if (this.unlockedSeats <= 3)
            return this.makeEvent('Lock failed', { description: "A minimum of 3 players are required to start the game." });
        const seat = this.seats.get(position);
        seat.lock();
        return this.makeEvent('seatLocked', { seatNumber: position });
    }


    unlockSeat(position: number) {
        const seat = this.seats.get(position);
        seat.unlock();
        return this.makeEvent('seatUnlocked', { seatNumber: position });
    }


    // Get first seated player
    private get getSeatedPlayer(): Seat {
        return [...this.seats.values()].find(s => s.playerId !== null);
    }

    // Clear seat
    private vacateSeat(playerId: string): boolean {
        const seat = [...this.seats.values()].find(s => s.playerId === playerId);
        if (seat) seat.vacate();
        return (!!seat);
    }

    private makeEvent(type: string, data: any): Event {
        return { type, data };
    }

    // Check if player is seated
    private playerIsSeated(playerId: string): boolean {
        return ([...this.seats.values()].findIndex(s => s.playerId === playerId) !== -1);
    }

    // Validate password 
    private validate(password: string) {
        return (this.password !== null && this.password !== password);
    }
}