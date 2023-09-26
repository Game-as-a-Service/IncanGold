import { IIncanGoldRepository } from "../app/Repository";
import { AppDataSource } from "../../Shared/infra/data-source";
import type { DataSource, QueryRunner } from "typeorm";
import { IncanGoldMapper } from "./IncanGoldMapper";
import { IncanGoldData } from "./data/IncanGoldData";
import { ExplorerData } from "./data/ExplorerData";
import { CardData } from "./data/CardData";
import { IncanGold, CardInfo, Choice } from "../domain/IncanGold";
const { treasureCards, hazardCards, artifactCards } = CardInfo;

export class IncanGoldRepository implements IIncanGoldRepository {
    private dataSource: DataSource;
    private queryRunner: QueryRunner | null;
    private mapper: IncanGoldMapper;

    constructor() {
        this.dataSource = AppDataSource;
        this.mapper = new IncanGoldMapper();
    }

    async deleteById(gameId: string): Promise<number> {
        const { affected } = await this.dataSource.getRepository(IncanGoldData).delete({ id: gameId });
        return affected;
    }

    async create(id: string, explorerIDs: string[]): Promise<IncanGold> {
        const incanGoldData = this.createIncanGoldData(explorerIDs, id);
        await this.dataSource.getRepository(IncanGoldData).save(incanGoldData);
        return this.mapper.toDomain(incanGoldData);
    }

    async findById(gameId: string): Promise<IncanGold|undefined> {
        this.queryRunner = await this.createQueryRunner();
        let incanGoldData: IncanGoldData;

        try {
            incanGoldData = await this.queryRunner.manager.getRepository(IncanGoldData).findOne({
                where: { id: gameId },
                lock: { mode: "pessimistic_write" },
            });
        } catch (err) {
            this.queryRunner.commitTransaction();
            this.queryRunner.rollbackTransaction();
            this.queryRunner.release();
            throw err;
        }

        if(incanGoldData)
            return this.mapper.toDomain(incanGoldData);
        else
            return undefined;
    }

    async save(game: IncanGold): Promise<void> {
        const incanGoldData = this.mapper.toData(game);
        this.queryRunner = this.queryRunner ?? await this.createQueryRunner();

        try {
            await this.updateExplorers(incanGoldData.explorers);
            await this.updateGame(incanGoldData);
            await this.queryRunner.commitTransaction();
        } catch (err) {
            await this.queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await this.queryRunner.release();
        }
    }

    private async updateGame(incanGoldData: IncanGoldData) {
        const { id, round, turn, tunnel, deck, trashDeck } = incanGoldData;
        await this.queryRunner.manager.createQueryBuilder()
            .update(IncanGoldData)
            .set({ round, turn, tunnel, deck, trashDeck })
            .where("id = :id", { id })
            .execute();
    }

    private async updateExplorers(explorers: ExplorerData[]) {
        const explorerPromise = explorers.map(explorer => {
            const { id, choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts } = explorer;

            this.queryRunner.manager.createQueryBuilder()
                .update(ExplorerData)
                .set({ choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts })
                .where("id = :id", { id })
                .execute();
        });
        await Promise.all(explorerPromise);
    }

    private async createQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    private createIncanGoldData(explorerIDs: string[], id: string) {
        const explorers = this.createExplorers(explorerIDs);
        const deck = this.createDeck();
        const trashDeck: Record<number, CardData[]> = {};
        [1, 2, 3, 4, 5].forEach(round => {
            trashDeck[round] = [];
        })
        const incanGoldData = IncanGoldData.generateBy(id, 0, 0, [], deck, trashDeck, explorers);
        return incanGoldData;
    }

    private createExplorers(explorerIDs: string[]) {
        return explorerIDs.map(id => ExplorerData.generateBy(id, Choice.NotSelected, true, 0, 0, 0, []));
    }

    private createDeck() {
        const treasureCardsData = [...Object.entries(treasureCards)]
            .map(c => new CardData(c[0]));

        const hazardCardsData = [...Object.entries(hazardCards)]
            .map(c => new CardData(c[0]));

        return [...treasureCardsData, ...hazardCardsData];
    }

}