import {IStartGameRepository} from '../Repository';
import IncanGold from '../../../packages/incan-gold-core/src/domain/entities/IncanGold';
import { GameStatus,toGameStatus } from '../Dto/IncanGoldDto';
import { EventDto } from '../Dto/EventDto/EventDto';
import { transformEventsToEventDtos } from '../Dto/TransformEventsToEventDtos';

// Create a game entity using the room ID and the players' IDs 
// (the game entity's ID will be the room ID), 
// and start the game until the first round's first turn, which is the "selection" phase.
export default class StartGameUseCase {
    private _incanGoldRepository: IStartGameRepository;

    constructor(incanGoldRepository: IStartGameRepository) {
        this._incanGoldRepository = incanGoldRepository;
    }
  
    async execute(input:StartGameInput):Promise<StartGameOutput>{
        // 創(沒得查，因為還沒有game)
        var incanGold = this._incanGoldRepository.creatGame(input.roomID, input.plyerIDs);
        
        // 改
        const events = Array.from(incanGold.start());

        // 存
        this._incanGoldRepository.save(incanGold);

        // 推
        return {
            game:toGameStatus(incanGold),
            events: transformEventsToEventDtos.execute(events)
        };
    }
}

export interface StartGameInput {
    roomID: string;
    plyerIDs: string[];
}

interface StartGameOutput {
    game: GameStatus;
    events:EventDto[];
}