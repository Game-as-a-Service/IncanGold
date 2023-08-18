import type { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto,RoomDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";

export default class ReadyUseCase {

    private roomRepository: IRoomRepository;

    constructor(roomRepository: IRoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(input: ReadyInput): Promise<ReadyOutput> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const events = Array.from(room.ready(input.playerId));

        // 存
        await this.roomRepository.save(room);

        // 推
        return {
            room: flattenToDto(room),
            events
        }
    }
}

export interface ReadyInput {
    roomId: string;
    playerId: string;
}

export interface ReadyOutput {
    room: RoomDto;
    events: Event[];
}