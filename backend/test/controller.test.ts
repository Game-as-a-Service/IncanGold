import { configDataSource,AppDataSource } from "../frameworks/data-services/orm/data-source";
import { expect,describe, test, afterAll, beforeAll } from 'vitest';
import { MySqlContainer } from "testcontainers";
import { incanGoldController } from "gateway/controllers/IncanGold.controller";
import { StartGameInput } from "app/useCase/StartGameUseCase";
import { MakeChoiceInput } from "app/useCase/MakeChoiceUseCase";
import { Choice } from "../../packages/incan-gold-core/src/domain/constant/Choice";


describe("以controller的視角進行測試", ()=>{

    var container;

    beforeAll(async()=>{
       
        container = await new MySqlContainer()
        .withExposedPorts(3306)
        .withRootPassword('123456')
        .withDatabase('test')
        .start();

        configDataSource(container.getHost(),container.getMappedPort(3306));
        await AppDataSource.initialize();
    })

    afterAll(async () => {
        await container.stop();
    });

    test('startGame', async () => {

        // container = await new MySqlContainer()
        // .withExposedPorts(3306)
        // .withRootPassword('123456')
        // .withDatabase('test')
        // .start();

        // configDataSource(container.getHost(),container.getMappedPort(3306));
        // await AppDataSource.initialize();

        console.log(1);

        // let result = await startGame('1',['a','b','c']);
        // console.log(JSON.stringify(result.game));
        // console.log(JSON.stringify(result.events));
        // result = await makeChoice('1','a',Choice.Quit);
        // console.log(JSON.stringify(result.game));
        // console.log(JSON.stringify(result.events));
    
    });

})




async function startGame(roomID:string, plyerIDs:string[]){
    console.log(1);
    const input:StartGameInput = { roomID, plyerIDs };
    console.log(1);
    return await incanGoldController.StartGame(input);
}

async function makeChoice(gameId:string, playerId:string, choice:string){
    console.log(2);
    const input:MakeChoiceInput = { gameId,playerId,choice };
    console.log(2);
    return await incanGoldController.MakeChoice(input);
}
