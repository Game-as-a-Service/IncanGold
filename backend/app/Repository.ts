import IncanGold from "../../packages/incan-gold-core/src/domain/entities/IncanGold";

export interface IRepository {
    findGameById(gameId:string):Promise<IncanGold>;
    
    save(game:IncanGold): Promise<void>;
}

export interface IStartGameRepository {
    
    save(game:IncanGold): Promise<void>;

    creatGame(id: string, playerIDs:string[]):IncanGold;
}
