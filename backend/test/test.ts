import StartGameUseCase, { StartGameInput } from "app/IncanGold/useCase/StartGameUseCase";
import { IncanGoldRepository } from "frameworks/data-services/IncanGold/IncanGoldRepository";
import { AppDataSource,configDataSource } from "frameworks/data-services/data-source";
import { Choice } from "domain/incan-gold-core/src/domain/constant/Choice";
import MakeChoiceUseCase, {MakeChoiceInput} from "app/IncanGold/useCase/MakeChoiceUseCase";
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
    makeChoice('2','a',Choice.Quit);
    makeChoice('2','b',Choice.KeepGoing);
    makeChoice('2','c',Choice.Quit);
}


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


app();