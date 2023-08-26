import { IIncanGoldRepository } from '../Repository';
import { toGameStatus } from '../Dto/IncanGoldDto';
import { eventDtoMapper } from '../Dto/EventDtoMapper';
import { EventDto } from '../Dto/EventDto/EventDto';
import { Event, IncanGold, Choice } from "../../domain/IncanGold"
import { Output } from '../Dto/UseCaseOutput';
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";

export default class MakeChoiceUseCase {
    private incanGoldRepository: IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(incanGoldRepository: IIncanGoldRepository, eventDispatcher: IEventDispatcher) {
        this.incanGoldRepository = incanGoldRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: MakeChoiceInput): Promise<void> {
        const { gameId, explorerId, choice } = input;
        // 查
        const incanGold = await this.incanGoldRepository.findById(gameId);
        const explorer = incanGold.getExplorer(explorerId);

        // 改
        const events = Array.from(incanGold.makeChoice(explorer, choice as Choice));

        // 存
        await this.incanGoldRepository.save(incanGold);

        // 推
        const game = toGameStatus(incanGold);
        const eventDtos = eventDtoMapper.execute(events);
        this.eventDispatcher.emit('IncanGold', gameId, Output(game,eventDtos))
    }
}

export interface MakeChoiceInput {
    gameId: string
    explorerId: string
    choice: string
}