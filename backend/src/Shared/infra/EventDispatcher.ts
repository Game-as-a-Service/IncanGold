import { IEventDispatcher } from "../interface/EventDispatcher";
import { SocketManager } from "./socket";
import { Event } from "../../Room/domain/event/Event";
import { EventEmitter } from "events"

export class EventDispatcher implements IEventDispatcher {

    private static _dispatcher:EventDispatcher;
    private eventEmiter: EventEmitter;

    private constructor() {
        this.eventEmiter = new EventEmitter();
    }

    emit(eventName: string, ...args: any[]): boolean {
        return this.eventEmiter.emit(eventName, ...args);
    }

    on(eventName: string , listener: (...args: any[]) => void){
        this.eventEmiter.on(eventName, listener);
    }

    static get dispatcher(){
        this._dispatcher = this._dispatcher ?? new EventDispatcher();
        return Object.freeze(this._dispatcher);
    }
}

