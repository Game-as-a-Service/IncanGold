import Game from '../../domain/entities/IncanGold_ver2'
import Player, {Choice} from '../../domain/entities/Player'
import IncanGoldRepository from '../Repository/IncanGoldRepository'
import Event  from '../../domain/events/Event';

// 玩家做出選擇

class MakeChoiceUsecase {
    public incanGoldRepository : IncanGoldRepository;

    constructor(incanGoldRepository:IncanGoldRepository){
        this.incanGoldRepository = incanGoldRepository;
    }

    public execute(input:Input):void{
        // 查
        var game = this.findGame(input);

        // 改
        var player:Player = game.getPlayer(input.plyerID);
        var events = Array.from(game.makeChoice(player,input.choice))

        // 存 推
        this.incanGoldRepository.saveAndBroadcast(game, events);
    }

    private findGame(input:Input):Game{
        return this.incanGoldRepository.findGameById(new GameId(input.gameId).orElseThrow());
    }
}

interface Input{
    gameId: number;
    plyerID : number;
    choice : Choice; 
}

