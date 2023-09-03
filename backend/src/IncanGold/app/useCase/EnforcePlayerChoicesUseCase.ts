import { IIncanGoldRepository } from '../Repository';
import { Output } from '../Dto/UseCaseOutput';
import { IEventDispatcher } from "../../../Shared/interface/EventDispatcher";

export default class EnforcePlayerChoicesUseCase {
    private incanGoldRepository: IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(incanGoldRepository: IIncanGoldRepository, eventDispatcher: IEventDispatcher) {
        this.incanGoldRepository = incanGoldRepository;
        this.eventDispatcher = eventDispatcher;
    }

    async execute(input: EnforcePlayerChoicesInput): Promise<void> {
        const { gameId } = input;
        // 查
        const incanGold = await this.incanGoldRepository.findById(gameId);

        // 改
        const events = Array.from(incanGold.enforcePlayerChoices());

        // 存
        await this.incanGoldRepository.save(incanGold);

        // 推
        this.eventDispatcher.emit('IncanGold', gameId, Output(incanGold, events))
    }
}

export interface EnforcePlayerChoicesInput {
    gameId: string,
    round: number,
    turn: number
}
