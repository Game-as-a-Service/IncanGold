import type { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto,RoomDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";

export default class UnlockSeatUseCase {

    private roomRepository: IRoomRepository;

    constructor(roomRepository: IRoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(input: UnlockSeatInput): Promise<UnlockSeatOutput> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const events = room.unlockSeat(input.seatNumber);

        // 存
        await this.roomRepository.save(room);

        // 推
        return {
            room: flattenToDto(room),
            events:[events]
        }
    }
}

export interface UnlockSeatInput {
    roomId: string;
    seatNumber: number;
}

export interface UnlockSeatOutput {
    room: RoomDto;
    events: Event[];
}