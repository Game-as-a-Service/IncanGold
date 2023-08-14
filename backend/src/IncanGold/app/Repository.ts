import { IncanGold } from "../domain/IncanGold";

export interface IIncanGoldRepository {
    create(id: string, explorerIDs:string[]):IncanGold;

    findById(gameId:string):Promise<IncanGold|undefined>;
    
    save(game:IncanGold): Promise<void>;
}

