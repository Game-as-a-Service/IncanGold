import { IIncanGoldRepository } from '../Repository';
import { Choice } from "../../domain/IncanGold"
import { Output } from '../Dto/UseCaseOutput';
import { IEventDispatcher } from "../../../Shared/app/Interface/EventDispatcher";

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

        // 改
        const events = Array.from(incanGold.makeChoice(explorerId, choice as Choice));

        // 存
        await this.incanGoldRepository.save(incanGold);

        // 推
        this.eventDispatcher.emit('IncanGold', gameId, Output(incanGold, events))
    }
}

export interface MakeChoiceInput {
    gameId: string
    explorerId: string
    choice: string
}