import { IEventDispatcher } from "../app/Interface/EventDispatcher";
import { SocketManager } from "./socket";
import { Event } from "../../Room/domain/event/Event";
import { EventEmitter } from "events"
import DeleteDataUseCase from "../app/DeleteDataUseCase";
import { RoomRepository } from "../../Room/infra/RoomRepository";
import { IncanGoldRepository } from "../../IncanGold/infra/IncanGoldRepository";
import { UserRepository } from "../../User/infra/UserRepository";
import { Request } from "express";

export class EventDispatcher implements IEventDispatcher {

    private static _dispatcher: EventDispatcher;
    private eventEmitter: EventEmitter;

    private constructor() {
        this.eventEmitter = new EventEmitter();

        const deleteUseCase = new DeleteDataUseCase(RoomRepository, IncanGoldRepository, UserRepository);

        this.eventEmitter.on('deleteGame', async (id: string) => {
            await deleteUseCase.deleteGame(id);
        });

        this.eventEmitter.on('deleteRoom', async (id: string) => {
            await deleteUseCase.deleteRoom(id);
        });
    }

    emit(eventName: string, ...args: any[]): boolean {
        return this.eventEmitter.emit(eventName, ...args);
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, listener);
    }

    static get dispatcher() {
        this._dispatcher = this._dispatcher ?? new EventDispatcher();
        return Object.freeze(this._dispatcher);
    }
}

