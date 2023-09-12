import type { Room } from "../../domain/Room";
import { Output } from "../dto/Output";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";

export default class ChangeHostUseCase {

    private roomRepository: IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(roomRepository: IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.roomRepository = roomRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: ChangeHostInput): Promise<void> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const event = room.setHost(input.playerId);

        // 存
        await this.roomRepository.save(room);

        // 推
        this.eventDispatcher.emit('room', Output(room, [event]));
    }
}

export interface ChangeHostInput {
    roomId: string;
    playerId: string;
}
