import { IncanGold } from "../domain/IncanGold";

export interface IIncanGoldRepository {
    create(id: string, explorerIDs:string[]):Promise<IncanGold>;

    findById(gameId:string):Promise<IncanGold|undefined>;
    
    save(game:IncanGold): Promise<void>;
}

