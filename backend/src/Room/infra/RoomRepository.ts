import type { Room } from "../domain/Room";
import { RoomData } from "./RoomData";
import { IRoomRepository } from "../app/Repository";
import { DataSource, QueryRunner, UpdateResult, EntityManager } from "typeorm";
import { AppDataSource } from "../../Shared/infra/data-source";
import { RoomMapper } from "./RoomMapper";
import { SeatData } from "./SeatData";
import { v4 as uuidv4 } from 'uuid';
import { STATE } from "../domain/constant/State";

export class RoomRepository implements IRoomRepository {

    private dataSource: DataSource;
    private mapper: RoomMapper = new RoomMapper();
    private room: RoomData | null = null;

    constructor() {
        this.dataSource = AppDataSource;
    }

    async create(roomName: string, password: string): Promise<Room> {
        const room = this.createRoomData(roomName, password);
        this.room = await this.dataSource.getRepository(RoomData).save(room, { reload: true });
        return this.mapper.toDomain(this.room);
    }

    async findById(roomId: string): Promise<Room | undefined> {
        this.room = await this.dataSource.getRepository(RoomData).findOneBy({ id: roomId });
        return this.mapper.toDomain(this.room);
    }

    async save(domainRoom: Room): Promise<void> {
        this.mapper.updateRoomData(domainRoom, this.room);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const manager = queryRunner.manager;
        try {
            await this.updateSeats(manager);
            await this.updateRoom(manager);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    private async updateSeats(manager: EntityManager) {

        const seatsPromise = this.room.seats.map(seat => {
            const { locked, playerId, state } = seat;
            return manager.createQueryBuilder()
                .update(SeatData)
                .set({ locked, playerId, state })
                .where("position = :position", { position: seat.position })
                .andWhere("roomId = :roomId", { roomId: this.room.id })
                .execute();
        })

        await Promise.all(seatsPromise)
    }

    private async updateRoom(manager: EntityManager) {
        const { passwd, hostId } = this.room;

        const result = await manager.createQueryBuilder()
            .update(RoomData)
            .set({
                passwd, hostId,
                version: this.room.version + 1
            })
            .where("id = :id", { id: this.room.id })
            .andWhere("version = :version", { version: this.room.version }) // Optimistic Lock
            .execute();

        if (result.affected === 0) // Incorrect version
            throw new Error('Concurrent modification error');
    }

    private createRoomData(roomName: string, password: string) {
        const room = new RoomData();
        room.id = '123'; // uuidv4();  change back later after test finish.
        room.name = roomName;
        if (password)
            room.passwd = password;

        room.seats =
            [1, 2, 3, 4, 5, 6, 7, 8].map(position => {
                const seat = new SeatData();
                seat.position = position;
                seat.playerId = null;
                seat.locked = false;
                seat.state = STATE.NULL;
                return seat;
            });

        return room;
    }
}

