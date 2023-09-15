import { Output } from "../dto/Output";
import { IRoomRepository } from "../Repository";
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";
import { flattenToDtoForListRooms } from "../dto/RoomDto";
import { Room } from "../../domain/Room";

export default class ListRoomsUseCase {

    private roomRepository: IRoomRepository;

    constructor(roomRepository: IRoomRepository) {
        this.roomRepository = roomRepository;
    }

    async execute() {
        // 查
        const rooms = await this.roomRepository.find();

        // 推
        if (rooms.length)
            return rooms.map(room => flattenToDtoForListRooms(room));
    }
}