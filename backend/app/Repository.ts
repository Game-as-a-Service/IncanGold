import IncanGold from "../../packages/incan-gold-core/src/domain/entities/IncanGold";

export interface IRepository {
    creatGame(id: string, playerIDs:string[]):IncanGold;

    findGameById(gameId:string):Promise<IncanGold>;
    
    save(game:IncanGold): Promise<void>;

    update(game:IncanGold): Promise<void>;

    executeTransaction():Promise<void>;

    setRunInTransaction(callback:Function):void;
}

