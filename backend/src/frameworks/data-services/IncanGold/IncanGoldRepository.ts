import { IIncanGoldRepository } from "../../../app/IncanGold/Repository";
import { AppDataSource } from "../data-source";
import type { DataSource, QueryRunner } from "typeorm";
import { Domain_OrmEntity_Transformer } from "./DomainEntityTransformer";
import { IncanGoldData } from "./data/IncanGoldData";
import { PlayerData } from "./data/PlayerData";
import { CardData, CardLocation } from "./data/CardData";
import { IncanGold, CardInfo } from "../../../domain/IncanGold";
const { treasureCards, hazardCards, artifactCards } = CardInfo;

export class IncanGoldRepository implements IIncanGoldRepository {
    private dataSource: DataSource;
    private queryRunner: QueryRunner | null;
    private transformer = new Domain_OrmEntity_Transformer();
    private _incanGoldData: IncanGoldData | null;
    private isGameInDB: boolean = true

    constructor() {
        this.dataSource = AppDataSource;
    }

    create(id: string, playerIDs: string[]): IncanGold {
        this.isGameInDB = false;
        this._incanGoldData = new IncanGoldData();
        this._incanGoldData.id = id;
        this.createPlayers(playerIDs);
        this.createCards();

        const incanGold = new IncanGold(id, playerIDs);
        return incanGold;
    }

    async findById(gameId: string): Promise<IncanGold> {
        this.queryRunner = this.dataSource.createQueryRunner();
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        try {
            this._incanGoldData = await this.queryRunner.manager.getRepository(IncanGoldData).findOne({
                where: { id: gameId },
                lock: { mode: "pessimistic_write" },
            });
        } catch (err) {
            this.queryRunner.commitTransaction();
            this.queryRunner.rollbackTransaction();
            this.queryRunner.release();
            throw err;
        }
        return this.transformer.toDomain(this._incanGoldData);
    }

    async save(game: IncanGold): Promise<void> {
        this.transformer.updateIncanGoldData(game, this._incanGoldData);

        if (this.isGameInDB) {
            try {
                await this.updateCards();
                await this.updatePlayers();
                await this.updateGame();
                await this.queryRunner.commitTransaction();
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await this.queryRunner.release();
            }
        } else {
            await this.dataSource.getRepository(IncanGoldData).save(this._incanGoldData);
            this.isGameInDB = true;
        }

    }

    private async updateGame() {
        await this.queryRunner.manager.getRepository(IncanGoldData).update({ id: this._incanGoldData.id }, {
            round: this._incanGoldData.round,
            turn: this._incanGoldData.turn,
        });
    }

    private async updatePlayers() {
        const playerPromise = this._incanGoldData.players.map(player => {
            const { id, choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts } = player;

            this.queryRunner.manager
                .getRepository(PlayerData)
                .update(
                    { id },
                    { choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts }
                );
        });
        await Promise.all(playerPromise);
    }

    private async updateCards() {
        const cardPromise = this._incanGoldData.cards.map(card => {
            const { cardID, gems, remainingGems, remainingArtifact, location, whenInTrashDeck } = card;

            this.queryRunner.manager
                .createQueryBuilder()
                .update(CardData)
                .set({ gems, remainingGems, remainingArtifact, location, whenInTrashDeck })
                .where({ cardID })
                .andWhere("incanGoldId = :incanGoldId", { incanGoldId: this._incanGoldData.id })
                .execute();
        });
        await Promise.all(cardPromise);
    }

    private createPlayers(playerIDs: string[]) {
        const players = playerIDs.map(playerID => {
            const player = new PlayerData();
            player.id = playerID;
            return player;
        });
        this._incanGoldData.players = players;
    }

    private createCards() {
        const cards: CardData[] = [];
        [...treasureCards, ...hazardCards, ...artifactCards].forEach(card => {
            const cardData = new CardData();
            cardData.cardID = card.ID;
            cardData.location = card.ID[0] === 'A' ? CardLocation.Temple : CardLocation.Deck;
            cards.push(cardData);
        });
        this._incanGoldData.cards = cards;
    }

}