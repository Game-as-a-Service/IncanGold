import { Room } from "../domain/Room";

export interface IRoomRepository {
    findById(gameId:string):Promise<Room|undefined>;
    
    save(game:Room): Promise<void>; 
}

