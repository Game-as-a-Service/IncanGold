import StartGameUseCase, { StartGameInput } from "../app/useCase/StartGameUseCase";
import { IncanGoldRepository } from "../frameworks/data-services/IncanGoldRepository";
import { AppDataSource } from "../frameworks/data-services/orm/data-source";
import { Choice } from "../../packages/incan-gold-core/src/domain/constant/Choice";
import MakeChoiceUseCase, { MakeChoiceInput } from "../app/useCase/MakeChoiceUseCase";

AppDataSource.initialize().then(async()=>{
    // await startGame('2',['a','b','c']);
    // makeChoice('2','a',Choice.Quit);
    // makeChoice('2','b',Choice.KeepGoing);
    makeChoice('2','c',Choice.Quit);
})

async function startGame(roomID:string, plyerIDs:string[]){
    const input:StartGameInput = { roomID, plyerIDs };
    const startGameUseCase = new StartGameUseCase(new IncanGoldRepository());
    const {game,events} = await startGameUseCase.execute(input);
    console.log(JSON.stringify(game));
    console.log(JSON.stringify(events));
}

async function makeChoice(gameId:string, playerId:string, choice:Choice){
    const input:MakeChoiceInput = { gameId,playerId,choice };
    const makeChoiceUseCase = new MakeChoiceUseCase(new IncanGoldRepository());
    const {game,events} = await makeChoiceUseCase.execute(input);
    console.log(JSON.stringify(game));
    console.log(JSON.stringify(events));
}