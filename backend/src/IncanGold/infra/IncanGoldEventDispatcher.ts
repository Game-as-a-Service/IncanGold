import { EventDispatcher } from "../../Shared/infra/EventDispatcher";
import { IEventDispatcher } from "../../Shared/interface/EventDispatcher";
import { SocketManager } from "../../Shared/infra/socket";
import { Output } from "../app/Dto/UseCaseOutput";

export class IncanGoldEventDispatcher implements IEventDispatcher {

    private eventDispatcher: Readonly<EventDispatcher>;

    constructor() {
        this.eventDispatcher = EventDispatcher.dispatcher;

        this.eventDispatcher.on("IncanGold", (gameId:string, useCaseOutput: Output) => {
            SocketManager.manger.broadcast(gameId, useCaseOutput);
        })
    }

    emit(eventName: string = 'IncanGold', ...args: any[]): boolean {
        return this.eventDispatcher.emit(eventName, ...args);
    }

}