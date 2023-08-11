import { IncanGold } from "../domain/IncanGold";

export interface IIncanGoldRepository {
    create(id: string, playerIDs:string[]):IncanGold;

    findById(gameId:string):Promise<IncanGold|undefined>;
    
    save(game:IncanGold): Promise<void>;
}

