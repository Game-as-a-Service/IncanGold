import {IRepository} from '../Repository';
import EventBus from '../EventBus';
import { GameStatus,toGameStatus } from '../IncanGoldDto';
import type IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { Choice } from '../../../packages/incan-gold-core/src/domain/constant/Choice';

export default class MakeChoiceUseCase {
    private _incanGoldRepository: IRepository;
    private _eventBus: EventBus;

    constructor(incanGoldRepository: IRepository, eventBus: EventBus) {
        this._incanGoldRepository = incanGoldRepository;
        this._eventBus = eventBus;
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
        this._eventBus.broadcast(events);

        return {
            statusCode:200,
            game:toGameStatus(incanGold)
        };
    }
}

export interface MakeChoiceInput {
    gameId: string
    playerId: string
    choice: string
}

interface MakeChoiceOutput {
    statusCode: number;
    game: GameStatus;
}