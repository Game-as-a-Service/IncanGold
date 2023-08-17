import type { Room } from "../domain/Room";
import { RoomData } from "./RoomData";
import { IRoomRepository } from "../app/Repository";
import { DataSource, QueryRunner, UpdateResult, EntityManager } from "typeorm";
import { AppDataSource } from "../../Shared_infra/data-source";
import { RoomMapper } from "./RoomMapper";
import { Seat } from "../domain/Seat";
import { PlayerData } from "./PlayerData";
import { v4 as uuidv4 } from 'uuid';

export class RoomRepository implements IRoomRepository {

    private dataSource: DataSource;
    private queryRunner: QueryRunner | null = null;
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
        const oldPlayers = this.room.players;
        this.mapper.updateRoomData(domainRoom, this.room);

        if (oldPlayers.length) {
            this.queryRunner = this.dataSource.createQueryRunner();
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const manager = this.queryRunner.manager;
            try {
                await this.modifyPlayers(manager, oldPlayers);
                await this.updateRoom(manager);
                await this.queryRunner.commitTransaction();
            } catch (err) {
                await this.queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await this.queryRunner.release();
            }
        }else {
            const manager = this.dataSource.manager;
            await this.modifyPlayers(manager, oldPlayers);
            await this.updateRoom(manager);
        }
    }

    private createRoomData(roomName: string, password: string) {
        const room = new RoomData();
        room.id = '123'; // uuidv4();  change back later after test finish.
        room.players = [];
        room.seats = {};
        [1, 2, 3, 4, 5, 6, 7, 8].forEach(index => {
            room.seats[index] = new Seat(false, null);
        });
        room.name = roomName;
        if (password)
            room.passwd = password;
        return room;
    }

    private async updateRoom(manager: EntityManager) {
        const result = await manager.createQueryBuilder()
            .update(RoomData)
            .set({
                name: this.room.name,
                passwd: this.room.passwd,
                hostId: this.room.hostId,
                seats: this.room.seats,

                version: this.room.version + 1
            })
            .where("id = :id", { id: this.room.id })
            .andWhere("version = :version", { version: this.room.version }) // Optimistic Lock
            .execute();

        if (result.affected === 0) // Incorrect version
            throw new Error('Concurrent modification error');
    }

    private async modifyPlayers(manager: EntityManager, oldPlayers: PlayerData[]) {
        let newPlayers = this.room.players;

        const toUpdates = newPlayers.filter(p => this.isIncludeId(p.id, oldPlayers));
        const toInserts = newPlayers.filter(p => !this.isIncludeId(p.id, oldPlayers));
        const toDeletes = oldPlayers.filter(p => !this.isIncludeId(p.id, newPlayers));

        const updatePromises = this.updatePlayers(toUpdates, manager);
        const insertPromise = this.insertPlayers(toInserts, manager);
        const deletePromises = this.deletePlayers(toDeletes, manager);

        await Promise.all([...deletePromises, ...updatePromises, insertPromise]);
    }

    private insertPlayers(toInserts: PlayerData[], manager: EntityManager) {
        return manager.getRepository(PlayerData).insert(toInserts);
    }

    private updatePlayers(toUpdates: PlayerData[], manager: EntityManager): Promise<UpdateResult>[] {
        return toUpdates.map(player => {
            const { state } = player;
            return manager.createQueryBuilder()
                .update(PlayerData)
                .set({ state })
                .where({ id: player.id })
                .execute();
        });
    }

    private deletePlayers(toDeletes: PlayerData[], manager: EntityManager) {
        return toDeletes.map(player => {
            manager.createQueryBuilder()
                .delete()
                .from(PlayerData)
                .where({ id: player.id })
                .execute();
        });
    }

    private isIncludeId(id: string, players: PlayerData[]): boolean {
        return !!(players.find(p => p.id === id));
    }

}

