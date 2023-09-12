import type { Room } from "../../domain/Room";
import { Output } from "../dto/Output";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";

export default class ReadyUseCase {

    private roomRepository: IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(roomRepository: IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.roomRepository = roomRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: ReadyInput): Promise<void> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const events = Array.from(room.ready(input.playerId));

        // 存
        await this.roomRepository.save(room);

        // 推
        this.eventDispatcher.emit('room', Output(room, events));
    }
}

export interface ReadyInput {
    roomId: string;
    playerId: string;
}

