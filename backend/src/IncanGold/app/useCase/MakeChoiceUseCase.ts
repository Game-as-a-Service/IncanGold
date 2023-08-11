import { IIncanGoldRepository } from '../Repository';
import { transformEventsToEventDtos } from '../Dto/TransformEventsToEventDtos';
import { GameStatus, toGameStatus } from '../Dto/IncanGoldDto';
import { EventDto } from '../Dto/EventDto/EventDto';
import { Event,IncanGold,Choice } from "../../domain/IncanGold"

export default class MakeChoiceUseCase {
    private _incanGoldRepository: IIncanGoldRepository;
    private _incanGold: IncanGold | null;
    private _events: Event[] = [];

    constructor(incanGoldRepository: IIncanGoldRepository) {
        this._incanGoldRepository = incanGoldRepository;
    }

    async execute(input: MakeChoiceInput): Promise<MakeChoiceOutput> {
        // 查
        this._incanGold = await this._incanGoldRepository.findById(input.gameId);
        const player = this._incanGold?.getPlayer(input.playerId);

        // 改
        this._events = Array.from(this._incanGold.makeChoice(player, input.choice as Choice));

        // 存
        await this._incanGoldRepository.save(this._incanGold);

        // 推
        return {
            game: toGameStatus(this._incanGold),
            events: transformEventsToEventDtos.execute(this._events)
        };
    }
}

export interface MakeChoiceInput {
    gameId: string
    playerId: string
    choice: string
}

export interface MakeChoiceOutput {
    game: GameStatus;
    events: EventDto[];
}