import { IRepository } from '../../app/Repository';
import IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { AppDataSource } from './orm/data-source';
import { IncanGoldData } from './orm/IncanGoldData';
import { Domain_OrmEntity_Transformer } from './DomainEntityTransformer';
import type { DataSource } from 'typeorm';
import { PlayerData } from './orm/PlayerData';
import { CardData, CardLocation } from './orm/CardData';

export class IncanGoldRepository implements IRepository {
  private _dataSource: DataSource = AppDataSource;
  private _transformer: Domain_OrmEntity_Transformer = new Domain_OrmEntity_Transformer();
  private _incanGoldData: IncanGoldData | null;
  private _iterator: AsyncGenerator<IncanGoldData, void, unknown>|null;

  async findGameById(id: string): Promise<IncanGold> {
    this._iterator = this.runTransaction(id);
    const result = await this._iterator.next();
    if(result.value) this._incanGoldData = result.value;
    if (this._incanGoldData === null) throw "can't find game";
    return this._transformer.toDomain(this._incanGoldData);
  }

  async save(incanGold: IncanGold): Promise<void> {
    this._transformer.updateIncanGoldData(incanGold, this._incanGoldData);
    await this._iterator.next();
  }

  async *runTransaction(id: string) : AsyncGenerator<IncanGoldData, void, unknown> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      yield await queryRunner.manager.getRepository(IncanGoldData).findOne({
        where:{id},
        lock:{mode:"pessimistic_write"},
      })

      const cardPromise = this._incanGoldData.cards.map(card=>{
        queryRunner.manager.getRepository(CardData).update({cardID:card.cardID},card);
      });
      await Promise.all(cardPromise);

      const playerPromise = this._incanGoldData.players.map(player=>{
        queryRunner.manager.getRepository(PlayerData).update({id:player.id},player);
      });
      await Promise.all(playerPromise);

      await queryRunner.manager.getRepository(IncanGoldData).update({id},{
        round : this._incanGoldData.round,
        turn : this._incanGoldData.turn,
      });

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}