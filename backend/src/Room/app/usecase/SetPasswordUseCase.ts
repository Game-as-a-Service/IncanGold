import type { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto,RoomDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";

export default class SetPasswordUseCase {

    private roomRepository: IRoomRepository;

    constructor(roomRepository: IRoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute(input: SetPasswordInput): Promise<SetPasswordOutput> {
        // 查
        const room:Room = await this.roomRepository.findById(input.roomId);

        // 改
        const event = room.setPassword(input.password)

        // 存
        await this.roomRepository.save(room);

        // 推
        return {
            room: flattenToDto(room),
            events:[event]
        }
    }
}

export interface SetPasswordInput {
    roomId: string;
    password: string;
}

export interface SetPasswordOutput {
    room: RoomDto;
    events: Event[];
}