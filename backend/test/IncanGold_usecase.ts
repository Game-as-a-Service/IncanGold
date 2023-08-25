import StartGameUseCase, {StartGameInput} from "../src/IncanGold/app/useCase/StartGameUseCase";
import EnforcePlayerChoicesUseCase, {EnforcePlayerChoicesInput} from "../src/IncanGold/app/useCase/EnforcePlayerChoicesUseCase";
import { IncanGoldRepository } from "../src/IncanGold/infra/IncanGoldRepository";
import { configDataSource, AppDataSource } from "../src/Shared/infra/data-source";
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

    let date1:Date = await startGame('2',['a','b','c']);
    // const date2:Date = new Date();
    // const diff = date2.getTime() - date1.getTime();
    // console.log(Math.round(diff)); // 65

    let p1 = await makeChoice('2','a',Choice.Quit);
    const p2 = await makeChoice('2','b',Choice.KeepGoing);
    // const p3 = makeChoice('2','c',Choice.Quit);
    // await Promise.all([p1,p2,p3]);
    await enforcePlayerChoices('2');
}

async function enforcePlayerChoices(gameId:string){
    const usecase = new EnforcePlayerChoicesUseCase(new IncanGoldRepository());
    const {game,events} = await usecase.execute({gameId:'2'});
    console.log(JSON.stringify(game),"\n")
    console.log(JSON.stringify(events));
}

async function startGame(roomId:string, playerIds:string[]){
    const date = new Date();
    const input:StartGameInput = { roomId, playerIds };
    const startGameUseCase = new StartGameUseCase(new IncanGoldRepository());
    const {game,events} = await startGameUseCase.execute(input);
    // console.log(JSON.stringify(game),"\n");
    // console.log(JSON.stringify(events));
    return date;
}

async function makeChoice(gameId:string, explorerId:string, choice:Choice){
    const date = new Date();
    const input:MakeChoiceInput = { gameId,explorerId,choice };
    const makeChoiceUseCase = new MakeChoiceUseCase(new IncanGoldRepository());
    const {game,events} = await makeChoiceUseCase.execute(input);
    // console.log(JSON.stringify(game));
    console.log(JSON.stringify(events),"\n");
    return date;
}

app();