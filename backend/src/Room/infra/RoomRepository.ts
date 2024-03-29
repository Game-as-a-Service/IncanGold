import type { Room } from "../domain/Room";
import { RoomData } from "./RoomData";
import { IRoomRepository } from "../app/Repository";
import { DataSource, QueryRunner, UpdateResult, EntityManager } from "typeorm";
import { AppDataSource } from "../../Shared/infra/data-source";
import { RoomMapper } from "./RoomMapper";
import { SeatData } from "./SeatData";
import { v4 as uuidv4 } from 'uuid';
import { ROOMSTATE, STATE } from "../domain/constant/State";

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

    async find(): Promise<Room[] | undefined[]> {
        const rooms = await this.dataSource.getRepository(RoomData).find();
        return rooms.map(room => this.mapper.toDomain(room));
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

    async deleteById(roomId: string): Promise<number> {
        const { affected } = await this.dataSource.getRepository(RoomData).delete({ id: roomId });
        return affected;
    }

    private async updateSeats(manager: EntityManager) {

        const seatsPromise = this.room.seats.map(seat => {
            const { locked, playerId, state, position } = seat;
            return manager.createQueryBuilder()
                .update(SeatData)
                .set({ locked, playerId, state })
                .where("position = :position", { position })
                .andWhere("roomId = :roomId", { roomId: this.room.id })
                .execute();
        })

        await Promise.all(seatsPromise)
    }

    private async updateRoom(manager: EntityManager) {
        const { id, passwd, hostId, state, version } = this.room;

        const result = await manager.createQueryBuilder()
            .update(RoomData)
            .set({
                passwd, hostId, state,
                version: version + 1
            })
            .where("id = :id", { id })
            .andWhere("version = :version", { version }) // Optimistic Lock
            .execute();

        if (result.affected === 0) // Incorrect version
            throw new Error('Incorrect data version! concurrent modification error!');
    }

    private createRoomData(roomName: string, password: string) {
        const room = new RoomData();
        room.id = uuidv4();
        room.state = ROOMSTATE.WAITING;
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

