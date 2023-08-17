import { STATE } from './constant/State';

export class Seat {
    public locked: boolean = false;
    public playerId: string | null;
    public state: STATE = STATE.NULL;

    constructor(locked: boolean, playerId: string | null, state?: STATE) {
        this.locked = locked;
        this.playerId = playerId;
        this.state = state;
    }

    get isAvailable(): boolean {
        return !(this.locked || this.playerId);
    }

    sitDown(playerId: string): void {
        this.playerId = playerId;
        this.state = STATE.NOTREADY;
    }

    vacate(): void {
        this.playerId = null;
        this.state = STATE.NULL;
    }
}