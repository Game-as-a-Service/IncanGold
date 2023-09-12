import type { Room } from "../../domain/Room";
import { Output } from "../dto/Output";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";


export default class UnlockSeatUseCase {

    private roomRepository: IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(roomRepository: IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.roomRepository = roomRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: UnlockSeatInput): Promise<void> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const event = room.unlockSeat(input.seatNumber);

        // 存
        await this.roomRepository.save(room);

        // 推
        this.eventDispatcher.emit('room', Output(room, [event]));
    }
}

export interface UnlockSeatInput {
    roomId: string;
    seatNumber: number;
}

