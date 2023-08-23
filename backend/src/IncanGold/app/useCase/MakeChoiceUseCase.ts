import { IIncanGoldRepository } from '../Repository';
import { transformEventsToEventDtos } from '../Dto/TransformEventsToEventDtos';
import { GameStatus, toGameStatus } from '../Dto/IncanGoldDto';
import { EventDto } from '../Dto/EventDto/EventDto';
import { Event,IncanGold,Choice } from "../../domain/IncanGold"

export default class MakeChoiceUseCase {
    private _incanGoldRepository: IIncanGoldRepository;

    constructor(incanGoldRepository: IIncanGoldRepository) {
        this._incanGoldRepository = incanGoldRepository;
    }

    async execute(input: MakeChoiceInput): Promise<MakeChoiceOutput> {
        // 查
        const incanGold = await this._incanGoldRepository.findById(input.gameId);
        const explorer = incanGold.getExplorer(input.explorerId);

        // 改
        const events = Array.from(incanGold.makeChoice(explorer, input.choice as Choice));

        // 存
        // try{
            await this._incanGoldRepository.save(incanGold);
        // }catch(err){
        //     await this.execute(input);
        // }

        // 推
        return {
            game: toGameStatus(incanGold),
            events: transformEventsToEventDtos.execute(events)
        };
    }
}

export interface MakeChoiceInput {
    gameId: string
    explorerId: string
    choice: string
}

export interface MakeChoiceOutput {
    game: GameStatus;
    events: EventDto[];
}