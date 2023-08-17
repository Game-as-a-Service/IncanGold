export class Seat{
    public locked: boolean = false;
    public playerId: string | null;

    constructor(locked:boolean, playerId:string | null){
        this.locked = locked;
        this.playerId = playerId;
    }

    get isAvailable (): boolean{
        return !(this.locked || this.playerId);
    }
}