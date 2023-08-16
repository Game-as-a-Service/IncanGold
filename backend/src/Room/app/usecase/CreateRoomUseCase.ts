import { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto,RoomDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../EventDispatcher";

export default class CreateRoomUseCase {

    private roomRepository: IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(roomRepository: IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.roomRepository = roomRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: CreateRoomInput): Promise<CreateRoomOutput> {
        // 創
        const room = await this.roomRepository.create(input.roomName,input.password);

        // 改
        const events = Array.from(room.joinRoom(input.playerId, input.password));
 
        // 存
        await this.roomRepository.save(room);

        // 推
        this.eventDispatcher.dispatch(events);

        return {
            room: flattenToDto(room),
            events
        }
    }
}

export interface CreateRoomInput {
    playerId: string;
    roomName: string;
    password?: string;
}

export interface CreateRoomOutput {
    room: RoomDto; 
    events: Event[];
}