import type { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto,RoomDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";

export default class ChangeHostUseCase {

    private roomRepository: IRoomRepository;

    constructor(roomRepository: IRoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(input: ChangeHostInput): Promise<ChangeHostOutput> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const event = room.setHost(input.playerId);

        // 存
        await this.roomRepository.save(room);

        // 推
        return {
            room: flattenToDto(room),
            events:[event]
        }
    }
}

export interface ChangeHostInput {
    roomId: string;
    playerId: string;
}

export interface ChangeHostOutput {
    room: RoomDto;
    events: Event[];
}