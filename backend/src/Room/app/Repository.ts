import { Room } from "../domain/Room";

export interface IRoomRepository {

    create(roomName:string, password:string):Promise<Room>;

    findById(gameId:string):Promise<Room|undefined>;
    
    save(game:Room): Promise<void>; 
}

