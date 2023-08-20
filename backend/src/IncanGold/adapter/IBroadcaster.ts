export interface IBroadcaster {
    broadcast(gameId:string, payload: any): void;

    unicast(explorerId:string, payload:any):void;    
}