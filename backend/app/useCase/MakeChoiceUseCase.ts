import {IRepository} from '../Repository';
import { transformEventsToEventDtos } from '../Dto/TransformEventsToEventDtos';
import { GameStatus,toGameStatus } from '../Dto/IncanGoldDto';
import type IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { Choice } from '../../../packages/incan-gold-core/src/domain/constant/Choice';
import Event from '../../../packages/incan-gold-core/src/domain/events/Event';
import { EventDto } from '../Dto/EventDto/EventDto';

export default class MakeChoiceUseCase {
    private _incanGoldRepository: IRepository;

    constructor(incanGoldRepository: IRepository) {
        this._incanGoldRepository = incanGoldRepository;
    }
  
    async execute(input:MakeChoiceInput):Promise<MakeChoiceOutput>{
        // 查
        const incanGold:IncanGold = await this._incanGoldRepository.findGameById(input.gameId);
        const player = incanGold?.getPlayer(input.playerId);


        // 改
        const events = Array.from(incanGold.makeChoice(player,input.choice as Choice));

        // 存
        try{
            await this._incanGoldRepository.save(incanGold);
        }catch(e){
            await this.execute(input);
        }

        // 推
        return {
            game:toGameStatus(incanGold),
            events:transformEventsToEventDtos.execute(events)
        };
    }
}

export interface MakeChoiceInput {
    gameId: string
    playerId: string
    choice: string
}

interface MakeChoiceOutput {
    game: GameStatus;
    events:EventDto[];
}