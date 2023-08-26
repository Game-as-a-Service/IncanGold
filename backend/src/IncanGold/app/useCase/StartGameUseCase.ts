import { IIncanGoldRepository } from '../Repository';
import type { IncanGold } from "../../domain/IncanGold";
import { toGameStatus } from '../Dto/IncanGoldDto';
import { EventDto } from '../Dto/EventDto/EventDto';
import { eventDtoMapper } from '../Dto/EventDtoMapper';
import { Output } from '../Dto/UseCaseOutput';
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";

// Create a game entity using the room ID and the explorers' IDs 
// (the game entity's ID will be the room ID), 
// and start the game until the first round's first turn, which is the "selection" phase.
export default class StartGameUseCase {
    private incanGoldRepository: IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(incanGoldRepository: IIncanGoldRepository, eventDispatcher: IEventDispatcher) {
        this.incanGoldRepository = incanGoldRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: StartGameInput): Promise<void> {
        const { roomId, playerIds } = input;

        // 創(沒得查，因為還沒有game)
        var incanGold = await this.incanGoldRepository.create(roomId, playerIds);

        // 改
        const events = Array.from(incanGold.start());

        // 存
        await this.incanGoldRepository.save(incanGold);

        // 推
        const game = toGameStatus(incanGold);
        const eventDtos = eventDtoMapper.execute(events);
        this.eventDispatcher.emit('IncanGold', roomId, Output(game,eventDtos))

    }
}

export interface StartGameInput {
    roomId: string;
    playerIds: string[];
}
