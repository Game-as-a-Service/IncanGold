import { IEventDispatcher } from "../app/EventDispatcher";
import { SocketManager } from "../../Shared_infra/socket";
import { Event } from "../domain/event/Event";

export class RoomEventDispatcher implements IEventDispatcher {
    dispatch(event: Event): void {
        if (event.type === "roomCreated") {
            console.log("RoomEventDispatcher 8")
            SocketManager.manger.joinRoom(event.data.host, event.data.roomId)
        } else if (event.type === "joinRoom") {
            SocketManager.manger.joinRoom(event.data.playerId, event.data.roomId)
        }
    }
}
