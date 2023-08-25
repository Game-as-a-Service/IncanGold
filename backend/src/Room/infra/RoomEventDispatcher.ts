import { EventDispatcher } from "../../Shared/infra/EventDispatcher";
import { IEventDispatcher } from "../../Shared/interface/EventDispatcher";
import { SocketManager } from "../../Shared/infra/socket";
import { Output } from "../app/dto/Output";

export class RoomEventDispatcher implements IEventDispatcher {

    private eventDispatcher: Readonly<EventDispatcher>;

    constructor() {
        this.eventDispatcher = EventDispatcher.dispatcher;

        this.eventDispatcher.on("joinRoom", (data) => {
            const { playerId, roomId } = data;
            SocketManager.manger.joinRoom(playerId, roomId)
        })

        this.eventDispatcher.on("leaveRoom", (data) => {
            const { playerId, roomId } = data;
            SocketManager.manger.leaveRoom(playerId, roomId)
        })

        this.eventDispatcher.on("room", (useCaseOutput: Output) => {
            for (let event of useCaseOutput.events) {
                if (event.type === "joinRoom")
                    this.emit('joinRoom', event.data);
                if (event.type === "leaveRoom") {
                    this.emit('leaveRoom', event.data);
                    SocketManager.manger.unicast(event.data.playerId, "you leaved room.");
                }
            }
            const { id: roomId } = useCaseOutput.room;
            SocketManager.manger.broadcast(roomId, useCaseOutput);
        })
    }

    emit(eventName: string = 'room', ...args: any[]): boolean {
        return this.eventDispatcher.emit(eventName, ...args);
    }

}