import {IStartGameRepository} from '../Repository';
import EventBus from '../EventBus';
import IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { GameStatus,toGameStatus } from '../IncanGoldDto';

// Create a game entity using the room ID and the players' IDs 
// (the game entity's ID will be the room ID), 
// and start the game until the first round's first turn, which is the "selection" phase.
export default class StartGameUseCase {
    private _incanGoldRepository: IStartGameRepository;
    private _eventBus: EventBus;

    constructor(incanGoldRepository: IStartGameRepository, eventBus: EventBus) {
        this._incanGoldRepository = incanGoldRepository;
        this._eventBus = eventBus;
    }
  
    async execute(input:StartGameInput):Promise<StartGameOutput>{
        // 創(沒得查，因為還沒有game XD)
        var incanGold = this._incanGoldRepository.creatGame(input.roomID, input.plyerIDs);
        
        // 改
        const events = Array.from(incanGold.start());

        // 存
        this._incanGoldRepository.save(incanGold);

        // 推
        this._eventBus.broadcast(events);

        return {
            statusCode:200,
            game:toGameStatus(incanGold)
        };
    }
}

export interface StartGameInput {
    roomID: string;
    plyerIDs: string[];
}

interface StartGameOutput {
    statusCode: number;
    game: GameStatus;
}