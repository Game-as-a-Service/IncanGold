import IncanGold from "domain/incan-gold-core/src/domain/entities/IncanGold";

export interface IIncanGoldRepository {
    create(id: string, playerIDs:string[]):IncanGold;

    findById(gameId:string):Promise<IncanGold|undefined>;
    
    save(game:IncanGold): Promise<void>;
}

