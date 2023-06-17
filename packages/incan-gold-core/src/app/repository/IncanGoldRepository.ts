import IncanGold from "../../domain/entities/IncanGold";
import  Event  from '../../domain/events/Event';


export default interface IncanGoldRepository {

    findGameById(gameId:string):IncanGold;

    // save(IncanGold:Game):Game {
    //     return saveAndBroadcast(IncanGold, emptyList());
    // }

    saveAndBroadcast(game:IncanGold, events:Event[]): IncanGold;
}