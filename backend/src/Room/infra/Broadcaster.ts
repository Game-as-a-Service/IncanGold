import { IBroadcaster } from "../adapter/IBroadcaster";
import { SocketManager } from "../../Shared_infra/socket";

export class Broadcaster implements IBroadcaster {
    broadcast(roomId:string, payload: any): void{
        console.log('broadcast 6:', payload);
        SocketManager.manger.io.to(roomId).emit('message', payload);
    }

    unicast(userId, payload):void{
        const socketId = SocketManager.manger.get(userId).id;
        SocketManager.manger.io.to(socketId).emit('message', payload);
    }
}