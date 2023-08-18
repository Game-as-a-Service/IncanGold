import { IEventDispatcher } from "../app/EventDispatcher";
import { SocketManager } from "../../Shared_infra/socket";
import { Event } from "../domain/event/Event";

export class RoomEventDispatcher implements IEventDispatcher {
    dispatch(events: Event[]): void {
        for (const event of events) {
            const { playerId, roomId } = event.data;
            if (event.type === "joinRoom") {
                SocketManager.manger.joinRoom(playerId, roomId)
            } else if (event.type === "leaveRoom") {
                SocketManager.manger.leaveRoom(playerId, roomId)
            }
        }
    }
}
