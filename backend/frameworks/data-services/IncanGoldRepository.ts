import { IRepository } from "../../app/Repository";
import { AppDataSource } from "./orm/data-source";
import type { DataSource, QueryRunner } from "typeorm";
import { Domain_OrmEntity_Transformer } from "./DomainEntityTransformer";
import { IncanGoldData } from "./orm/IncanGoldData";
import { PlayerData } from "./orm/PlayerData";
import { CardData,CardLocation } from "./orm/CardData";
import IncanGold from "../../../packages/incan-gold-core/src/domain/entities/IncanGold";
import { pointsList,hazardNames } from "../../../packages/incan-gold-core/src/domain/constant/CardInfo";

export class IncanGoldRepository implements IRepository {
    private _dataSource: DataSource = AppDataSource;
    private _queryRunner : QueryRunner | null;
    private _transformer = new Domain_OrmEntity_Transformer();
    private _incanGoldData: IncanGoldData | null;
    private _callbacksRunInTransaction:Function[] = [];

    creatGame(id: string, playerIDs:string[]): IncanGold {
        this._incanGoldData = new IncanGoldData();
        this._incanGoldData.id = id;

        const players = playerIDs.map(playerID=>{
            const player = new PlayerData();
            player.id = playerID;
            return player;
        })
        this._incanGoldData.players = players;

        const cards:CardData[] = [];

        pointsList.forEach(points => {
        const card = new CardData();
        card.cardID = ("T"+points);
        card.location = CardLocation.Deck;
        cards.push(card);
        });
        [5,7,11].forEach( points =>{
            let tempcards = cards.filter(card=>new RegExp('^T' + points).test(card.cardID));
            tempcards[0].cardID += "(1)" ;
            tempcards[1].cardID += "(2)" ;
        })
            
        hazardNames.forEach(name=>{ 
            let cardID =  "H" + name.charAt(0).toUpperCase(); // HF (fire)
            let ids = Array(3).fill(cardID).map( (cardID,index) => (cardID + (index+1)) ) // HF1,HF2...
            ids.map(id=>{
            const card = new CardData();
            card.cardID = id;
            card.location = CardLocation.Deck;
            cards.push(card);
            });
        }); 

        [1,2,3,4,5].forEach(round=>{
        const card = new CardData();
        card.cardID = ("A"+round);
        card.location = CardLocation.Temple;
        cards.push(card);
        })

        this._incanGoldData.cards = cards;

        const incanGold = new IncanGold(id, playerIDs);
        return incanGold;
    }

    async findGameById(gameId:string): Promise<IncanGold> {
        this._incanGoldData = await this._queryRunner.manager.getRepository(IncanGoldData).findOne({
            where:{id:gameId},
            lock:{mode:"pessimistic_write"},
        });
        if (this._incanGoldData === null) throw "can't find game";
        return this._transformer.toDomain(this._incanGoldData);
    }
    
    async save(game:IncanGold): Promise<void> {
        this._transformer.updateIncanGoldData(game,this._incanGoldData);
        await this._dataSource.getRepository(IncanGoldData).save(this._incanGoldData);
    }

    async update(game:IncanGold): Promise<void> {
        this._transformer.updateIncanGoldData(game, this._incanGoldData);

        const cardPromise = this._incanGoldData.cards.map(card=>{
            this._queryRunner.manager.getRepository(CardData).update({cardID:card.cardID},card);
        });
        await Promise.all(cardPromise);
    
        const playerPromise = this._incanGoldData.players.map(player=>{
            this._queryRunner.manager.getRepository(PlayerData).update({id:player.id},player);
        });
        await Promise.all(playerPromise);
    
        await this._queryRunner.manager.getRepository(IncanGoldData).update({id:game.gameID},{
            round : this._incanGoldData.round,
            turn : this._incanGoldData.turn,
        });
    }

    async executeTransaction(): Promise<void> {
        this._queryRunner = this._dataSource.createQueryRunner();
        await this._queryRunner.connect();
        await this._queryRunner.startTransaction();
        try {
            for( const fn of this._callbacksRunInTransaction) await fn();
            await this._queryRunner.commitTransaction();
        } catch (err) {
            await this._queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await this._queryRunner.release();
            this._callbacksRunInTransaction = [];
        }
    }

    setRunInTransaction(callback:Function):void{
        this._callbacksRunInTransaction.push(callback);
    }
}