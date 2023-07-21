import StartGameUseCase, { StartGameInput } from "../app/useCase/StartGameUseCase";
import { IncanGoldRepository } from "../frameworks/data-services/IncanGoldRepository";
import ImplEventBus from "../gateway/eventBus/ImplEventBus";
import { AppDataSource } from "../frameworks/data-services/orm/data-source";
import { StartGameRepository } from "../frameworks/data-services/StartGameRepository";
import { Choice } from "../../packages/incan-gold-core/src/domain/constant/Choice";
import MakeChoiceUseCase, { MakeChoiceInput } from "../app/useCase/MakeChoiceUseCase";

AppDataSource.initialize().then(async()=>{
    // await startGame('1',['a','b','c']);
    makeChoice('1','a',Choice.Quit);
    makeChoice('1','b',Choice.Quit);
    makeChoice('1','c',Choice.Quit);
})

async function startGame(roomID:string, plyerIDs:string[]){
    const input:StartGameInput = { roomID, plyerIDs };
    const startGameUseCase = new StartGameUseCase(new StartGameRepository(), new ImplEventBus());
    const {game} = await startGameUseCase.execute(input);
    console.log(JSON.stringify(game));
}

async function makeChoice(gameId:string, playerId:string, choice:Choice){
    const input:MakeChoiceInput = { gameId,playerId,choice };
    const makeChoiceUseCase = new MakeChoiceUseCase(new IncanGoldRepository(), new ImplEventBus());
    const {game} = await makeChoiceUseCase.execute(input);
    console.log(JSON.stringify(game));
}