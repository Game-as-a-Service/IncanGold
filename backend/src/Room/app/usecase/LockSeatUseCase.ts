import type { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto,RoomDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";

export default class LockSeatUseCase {

    private roomRepository: IRoomRepository;

    constructor(roomRepository: IRoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(input: LockSeatInput): Promise<LockSeatOutput> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const events = room.lockSeat(input.seatNumber);

        // 存
        await this.roomRepository.save(room);

        // 推
        return {
            room: flattenToDto(room),
            events:[events]
        }
    }
}

export interface LockSeatInput {
    roomId: string;
    seatNumber: number;
}

export interface LockSeatOutput {
    room: RoomDto;
    events: Event[];
}