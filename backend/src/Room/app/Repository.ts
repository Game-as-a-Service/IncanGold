import { Room } from "../domain/Room";

export interface IRoomRepository {

    find(): Promise<Room[] | undefined[]>;

    create(roomName: string, password: string): Promise<Room>;

    findById(gameId: string): Promise<Room | undefined>;

    save(game: Room): Promise<void>;

    deleteById(id: string): Promise<number>;
}

