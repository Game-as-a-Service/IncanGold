import { IStartGameRepository } from '../../app/Repository';
import IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { AppDataSource } from './orm/data-source';
import { IncanGoldData } from './orm/IncanGoldData';
import { Domain_OrmEntity_Transformer } from './DomainEntityTransformer';
import type { DataSource } from 'typeorm';
import { PlayerData } from './orm/PlayerData';
import { pointsList,hazardNames } from '../../../packages/incan-gold-core/src/domain/constant/CardInfo';
import { CardData, CardLocation } from './orm/CardData';
import { version } from 'process';

export class StartGameRepository implements IStartGameRepository {
  private _dataSource:DataSource = AppDataSource;
  private _transformer:Domain_OrmEntity_Transformer = new Domain_OrmEntity_Transformer();
  private _incanGoldData:IncanGoldData|null;

    async save(incanGold: IncanGold): Promise<void> {
        this._transformer.updateIncanGoldData(incanGold,this._incanGoldData);
        await this._dataSource.getRepository(IncanGoldData).save(this._incanGoldData);
    }

    creatGame(id: string, playerIDs:string[]):IncanGold{
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

}