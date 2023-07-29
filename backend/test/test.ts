import StartGameUseCase, { StartGameInput } from "../app/useCase/StartGameUseCase";
import { IncanGoldRepository } from "../frameworks/data-services/IncanGoldRepository";
import { AppDataSource,configDataSource } from "../frameworks/data-services/orm/data-source";
import { Choice } from "../../packages/incan-gold-core/src/domain/constant/Choice";
import MakeChoiceUseCase, { MakeChoiceInput } from "../app/useCase/MakeChoiceUseCase";
import { MySqlContainer } from "testcontainers";

(async ()=>{

    const container = await new MySqlContainer()
    .withExposedPorts(3306)
    .withRootPassword('123456')
    .withDatabase('test')
    .start();

    configDataSource(container.getHost(),container.getMappedPort(3306));
    await AppDataSource.initialize();
    await startGame('5',['e','f','h']);
    makeChoice('5','e',Choice.Quit);
    // makeChoice('5','f',Choice.KeepGoing);
    // makeChoice('5','h',Choice.Quit);
    // await container.stop();
})()

async function startGame(roomID:string, plyerIDs:string[]){
    const input:StartGameInput = { roomID, plyerIDs };
    const startGameUseCase = new StartGameUseCase(new IncanGoldRepository());
    const {game,events} = await startGameUseCase.execute(input);
    console.log(JSON.stringify(game));
    // console.log(JSON.stringify(events));
}

async function makeChoice(gameId:string, playerId:string, choice:Choice){
    const input:MakeChoiceInput = { gameId,playerId,choice };
    const makeChoiceUseCase = new MakeChoiceUseCase(new IncanGoldRepository());
    const {game,events} = await makeChoiceUseCase.execute(input);
    // console.log(JSON.stringify(game));
    console.log(JSON.stringify(events));
}