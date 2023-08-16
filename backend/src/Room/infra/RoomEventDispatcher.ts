import { IEventDispatcher } from "../app/EventDispatcher";
import { SocketManager } from "../../Shared_infra/socket";
import { Event } from "../domain/event/Event";

export class RoomEventDispatcher implements IEventDispatcher {
    dispatch(events: Event[]): void {
        for (const event of events) {
            if (event.type === "joinRoom") {
                SocketManager.manger.joinRoom(event.data.playerId, event.data.roomId)
            }
        }
    }
}
