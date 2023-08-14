import { Room } from "../../domain/Room";
import { Event } from "../../domain/event/Event";
import { flattenToDto } from "../dto/RoomDto";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../EventDispatcher";
import { v4 as uuidv4 } from 'uuid';

export default class CreateRoomUseCase {

    private roomRepository: IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(roomRepository: IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.roomRepository = roomRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: CreateRoomInput): Promise<CreateRoomOutput> {
        console.log('create room use case 19')

        const roomId = uuidv4();

        // 創
        var { room, event } = Room.create(roomId, input.roomName, input.playerId, input.password);

        console.log('create room use case 26')
        console.log(event);
        console.log(room);
        // 存
        await this.roomRepository.save(room);

        console.log('create room use case 30')

        // 推
        this.eventDispatcher.dispatch(event);

        return {
            room: flattenToDto(room),
            event
        }
    }
}

export interface CreateRoomInput {
    playerId: string;
    roomName: string;
    password?: string;
}

export interface CreateRoomOutput {
    room: any; // RoomDto;
    event: Event;
}