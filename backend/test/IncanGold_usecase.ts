import StartGameUseCase, {StartGameInput} from "../src/IncanGold/app/useCase/StartGameUseCase";
import { IncanGoldRepository } from "../src/IncanGold/infra/IncanGoldRepository";
import { configDataSource, AppDataSource } from "../src/Shared_infra/data-source";
import { Choice } from "../src/IncanGold/domain/IncanGold";
import MakeChoiceUseCase, {MakeChoiceInput} from "../src/IncanGold/app/useCase/MakeChoiceUseCase";
import { MySqlContainer } from "testcontainers"


async function app(){
    const container = await new MySqlContainer()
    .withExposedPorts(3306)
    .withRootPassword('123456')
    .withDatabase('test')
    .start();

    configDataSource(container.getHost(),container.getMappedPort(3306));
    await AppDataSource.initialize();

    await startGame('2',['a','b','c']);
    await makeChoice('2','a',Choice.Quit);
    await makeChoice('2','b',Choice.KeepGoing);
    await makeChoice('2','c',Choice.Quit);
}


async function startGame(roomId:string, playerIds:string[]){
    const input:StartGameInput = { roomId, playerIds };
    const startGameUseCase = new StartGameUseCase(new IncanGoldRepository());
    const {game,events} = await startGameUseCase.execute(input);
    console.log(JSON.stringify(game),"\n");
    // console.log(JSON.stringify(events));
}

async function makeChoice(gameId:string, explorerId:string, choice:Choice){
    const input:MakeChoiceInput = { gameId,explorerId,choice };
    const makeChoiceUseCase = new MakeChoiceUseCase(new IncanGoldRepository());
    const {game,events} = await makeChoiceUseCase.execute(input);
    // console.log(JSON.stringify(game));
    console.log(JSON.stringify(events),"\n");
}

app();