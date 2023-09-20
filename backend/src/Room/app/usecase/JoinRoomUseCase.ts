import { Room } from "../../domain/Room";
import { Output } from "../dto/Output";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../../../Shared/app/Interface/EventDispatcher";

export default class JoinRoomUseCase {

    private roomRepository: IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(roomRepository: IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.roomRepository = roomRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: JoinRoomInput): Promise<void> {
        // 查
        const room = await this.roomRepository.findById(input.roomId);

        // 改
        const events = Array.from(room.joinRoom(input.playerId, input.password));

        // 存
        await this.roomRepository.save(room);

        // 推
        this.eventDispatcher.emit('room', Output(room, events));
    }
}

export interface JoinRoomInput {
    roomId: string;
    playerId: string;
    password?: string;
}
