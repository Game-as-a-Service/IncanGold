import type { Room } from "../domain/Room";
import { RoomData } from "./RoomData";
import { IRoomRepository } from "../app/Repository";
import { DataSource, QueryRunner } from "typeorm";
import { AppDataSource } from "../../Shared_infra/data-source";
import { RoomMapper } from "./RoomMapper";

export class RoomRepository implements IRoomRepository {

    private dataSource: DataSource;
    private queryRunner: QueryRunner | null;
    private mapper: RoomMapper = new RoomMapper();
    private room: RoomData | null;

    constructor() {
        this.dataSource = AppDataSource;
    }

    async findById(roomId: string): Promise<Room | undefined> {
        this.queryRunner = this.dataSource.createQueryRunner();
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();

        try {
            this.room = await this.queryRunner.manager.getRepository(RoomData).findOne({
                where: { id: roomId },
                lock: { mode: "pessimistic_write" },
            });
        } catch (err) {
            this.queryRunner.commitTransaction();
            this.queryRunner.rollbackTransaction();
            this.queryRunner.release();
            throw err;
        }
        return this.mapper.toDomain(this.room);
    }

    async save(domainRoom: Room): Promise<void> { // 回傳 room id

        console.log("RoomRepository save 40");

        if (this.room) {
            console.log("RoomRepository save 43");
            try {
                this.mapper.updateRoomData(domainRoom, this.room);
                await this.updateRoom();
                // await this.updateRoom();
                await this.queryRunner.commitTransaction();
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await this.queryRunner.release();
            }
        } else {
            console.log("RoomRepository save 55");
            this.room = this.mapper.createRoomData(domainRoom);
            console.log("RoomRepository save 57");
            await this.dataSource.getRepository(RoomData).save(this.room);
            console.log("RoomRepository save 59");
        }
    }

    async updateRoom(): Promise<void> {
        await this.queryRunner.manager.createQueryBuilder()
            .update(RoomData)
            .set({
                players: this.room.players,
                name: this.room.name,
                passwd: this.room.passwd,
                hostId: this.room.hostId,
                seats: this.room.seats,
            })
            .where("id = :id", { id: this.room.id })
            .execute();
    }
}

