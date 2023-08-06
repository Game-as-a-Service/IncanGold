import { configDataSource,AppDataSource } from "../frameworks/data-services/orm/data-source";
import { expect,describe, test, afterAll, beforeAll } from 'vitest';
import { MySqlContainer } from "testcontainers";
import { IncanGoldController } from "../gateway/controllers/IncanGold.controller";
import StartGameUseCase, { StartGameInput } from "../app/useCase/StartGameUseCase";
import { MakeChoiceInput } from "../app/useCase/MakeChoiceUseCase";
import { Choice } from "../../packages/incan-gold-core/src/domain/constant/Choice";
import { IncanGoldData } from "../frameworks/data-services/orm/IncanGoldData";
import { IncanGoldRepository } from "../frameworks/data-services/IncanGoldRepository";
import { PlayerData } from "../frameworks/data-services/orm/PlayerData";


describe("以controller的視角進行測試", ()=>{
    var container;

    // Create a container + ORM connection takes approximately 15 seconds, 
    // so to be on the safe side, we set the timeout to 20 seconds.
    beforeAll(async()=>{
        container = await new MySqlContainer()
        .withExposedPorts(3306)
        .withRootPassword('123456')
        .withDatabase('test')
        .start();

        configDataSource(container.getHost(),container.getMappedPort(3306));
        await AppDataSource.initialize();
    },20000) 

    afterAll(async () => {
        await container.stop();
    });

    test('runGame', async () => {
        try{
            
            await startGame('1',['a','b','c']); // 開始遊戲
            let m1 = makeChoice('1','a',Choice.Quit);    // a 選擇
            let m2 = makeChoice('1','b',Choice.Quit);    // b 選擇
            let m3 = makeChoice('1','c',Choice.KeepGoing); // c 選擇
            const arr = await Promise.all([m1,m2,m3]);
            // console.log(JSON.stringify(arr[2].events));
            // console.log(JSON.stringify(arr[1].events));
            // console.log(JSON.stringify(arr[0].events));
            console.log(JSON.stringify(arr[2].game));
            console.log(JSON.stringify(arr[1].game));
            console.log(JSON.stringify(arr[0].game));
        }catch(e){
            console.log(e);
        }
    },30000);
})

const incanGoldController = new IncanGoldController(IncanGoldRepository);

async function startGame(roomID:string, plyerIDs:string[]){
    const input:StartGameInput = { roomID, plyerIDs };
    return await incanGoldController.StartGame(input);
}

async function makeChoice(gameId:string, playerId:string, choice:string){
    const input:MakeChoiceInput = { gameId,playerId,choice };
    return await incanGoldController.MakeChoice(input);
}
