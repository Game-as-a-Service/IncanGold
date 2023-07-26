import { IRepository } from '../Repository';
import { transformEventsToEventDtos } from '../Dto/TransformEventsToEventDtos';
import { GameStatus,toGameStatus } from '../Dto/IncanGoldDto';
import type IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { Choice } from '../../../packages/incan-gold-core/src/domain/constant/Choice';
import Event from '../../../packages/incan-gold-core/src/domain/events/Event';
import { EventDto } from '../Dto/EventDto/EventDto';

export default class MakeChoiceUseCase {
    private _incanGoldRepository: IRepository;
    private _incanGold: IncanGold|null;
    private _events: Event[] = [];

    constructor(incanGoldRepository: IRepository) {
        this._incanGoldRepository = incanGoldRepository;
    }
  
    async execute(input:MakeChoiceInput):Promise<MakeChoiceOutput>{

        this._incanGoldRepository.setRunInTransaction((async function(){
            // 查
            this._incanGold = await this._incanGoldRepository.findGameById(input.gameId);
            const player = this._incanGold?.getPlayer(input.playerId);
            
            // 改
            this._events = Array.from(this._incanGold.makeChoice(player,input.choice as Choice));
            
            // 存
            await this._incanGoldRepository.update(this._incanGold);
        
        }).bind(this))
        
        try{
            await this._incanGoldRepository.executeTransaction();
        }catch(e){
            await this.execute(input);
        }

        // 推
        return {
            game:toGameStatus(this._incanGold),
            events:transformEventsToEventDtos.execute(this._events)
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