import Game from "../../domain/entities/IncanGold";
import { Event } from '../../domain/events/Event';


export default interface IncanGoldRepository {

    findGameById(gameId:string):Game;

    // save(IncanGold:Game):Game {
    //     return saveAndBroadcast(IncanGold, emptyList());
    // }

    saveAndBroadcast(game:Game, events:Event[]): Game;
}