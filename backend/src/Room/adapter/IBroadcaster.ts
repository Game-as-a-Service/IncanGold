

export interface IBroadcaster {
    broadcast(roomId:string, payload: any): void;

    unicast(userId, payload):void;    
}