import { IIncanGoldRepository } from "../app/Repository";
import { AppDataSource } from "../../Shared_infra/data-source";
import type { DataSource, QueryRunner } from "typeorm";
import { IncanGoldMapper } from "./IncanGoldMapper";
import { IncanGoldData } from "./data/IncanGoldData";
import { ExplorerData } from "./data/ExplorerData";
import { CardData } from "./data/CardData";
import { IncanGold, CardInfo, Choice } from "../domain/IncanGold";
const { treasureCards, hazardCards, artifactCards } = CardInfo;

export class IncanGoldRepository implements IIncanGoldRepository {
    private dataSource: DataSource;
    private mapper: IncanGoldMapper;
    private dataVersion: number = 0;

    constructor() {
        this.dataSource = AppDataSource;
        this.mapper = new IncanGoldMapper();
    }

    async create(id: string, explorerIDs: string[]): Promise<IncanGold> {
        const incanGoldData = this.createIncanGoldData(explorerIDs, id);
        await this.dataSource.getRepository(IncanGoldData).save(incanGoldData);
        this.dataVersion = incanGoldData.version;
        return this.mapper.toDomain(incanGoldData);
    }

    async findById(gameId: string): Promise<IncanGold> {
        const incanGoldData = await this.dataSource.getRepository(IncanGoldData).findOneBy({ id: gameId });
        this.dataVersion = incanGoldData.version;
        return this.mapper.toDomain(incanGoldData);
    }

    async save(game: IncanGold): Promise<void> {
        const incanGoldData = this.mapper.toData(game);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // console.log(42, incanGoldData)

        try {
            await this.updateExplorers(incanGoldData.explorers, queryRunner);
            await this.updateGame(incanGoldData, queryRunner);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    private async updateGame(incanGoldData: IncanGoldData, runner: QueryRunner) {
        const { id, round, turn, tunnel, deck, trashDeck } = incanGoldData;
        const result = await runner.manager.createQueryBuilder()
            .update(IncanGoldData)
            .set({
                round, turn, tunnel, deck, trashDeck,
                version: this.dataVersion + 1
            })
            .where("id = :id", { id })
            .andWhere("version = :version", { version: this.dataVersion }) // Optimistic Lock
            .execute();

        if (result.affected === 0) // Incorrect version
            throw new Error('Concurrent modification error');
    }

    private async updateExplorers(explorers: ExplorerData[], runner: QueryRunner) {
        const explorerPromise = explorers.map(explorer => {
            const { id, choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts } = explorer;

            runner.manager.createQueryBuilder()
                .update(ExplorerData)
                .set({ choice, inTent, gemsInBag, gemsInTent, totalPoints, artifacts })
                .where("id = :id", { id })
                .execute();
        });
        await Promise.all(explorerPromise);
    }

    private createIncanGoldData(explorerIDs: string[], id: string) {
        const explorers = this.createExplorers(explorerIDs);
        const deck = this.createDeck();
        const trashDeck: Record<number, CardData[]> = {};
        [1, 2, 3, 4, 5].forEach(round => {
            trashDeck[round] = [];
        })
        const incanGoldData = IncanGoldData.generateBy(id, 0, 0, [], deck, trashDeck, explorers, 0);
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