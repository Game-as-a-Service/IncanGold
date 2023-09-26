import type { Room } from "../../Room/domain/Room";
import { Output as RoomOutput } from "../../Room/app/dto/Output";
import { Output as IncanGoldOutput } from "../../IncanGold/app/Dto/UseCaseOutput";
import { IRoomRepository } from "../../Room/app/Repository";
import { IIncanGoldRepository } from "../../IncanGold/app/Repository";
import { IEventDispatcher } from "../../Shared/app/Interface/EventDispatcher";
import { substitute } from "./Substitute";

export default class StartGameUseCase {

    private roomRepository: IRoomRepository;
    private incanGoldRepository: IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(
        roomRepository: IRoomRepository,
        incanGoldRepository: IIncanGoldRepository,
        eventDispatcher: IEventDispatcher
    ) {
        this.roomRepository = roomRepository;
        this.incanGoldRepository = incanGoldRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: StartGameInput): Promise<void> {
        // 查
        const room: Room = await this.roomRepository.findById(input.roomId);

        // 改
        const event = room.startGame()

        // 存
        await this.roomRepository.save(room);

        // 推
        if (event.type === "can't StartGame") {
            this.eventDispatcher.emit('room', RoomOutput(room, [event]));
            return;
        } else {
            event.type = 'startTestGame';
            Object.freeze(event);
            this.eventDispatcher.emit('room', RoomOutput(room, [event]));
        }

        const { roomId, playerIds } = event.data;
        const { cardIds, hasShuffle, hasArtifactCard } = input;

        // 創
        const incanGold = await this.incanGoldRepository.create(roomId, playerIds);
        substitute(incanGold, hasShuffle, hasArtifactCard,cardIds)

        // 改
        const events = Array.from(incanGold.start());

        // 存
        await this.incanGoldRepository.save(incanGold);

        // 推
        this.eventDispatcher.emit('IncanGold', roomId, IncanGoldOutput(incanGold, events))
    }
}

export interface StartGameInput {
    roomId: string;
    cardIds: string[];
    hasShuffle: boolean;
    hasArtifactCard: boolean;
}
