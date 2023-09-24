import { bootstrap } from "../../../index";
import { Choice } from "../../../src/IncanGold/domain/IncanGold";
import { Client, createClients, joinRoom, ready } from "../../Client";
import { IncanGoldRouterForFrontendDev } from "../../../src/IncanGoldForFrontendDev/api/IncanGold.router";

(async () => {
    bootstrap.use("/test", IncanGoldRouterForFrontendDev())
    await bootstrap.start();
    const server = bootstrap.httpServer;
    const [hansen, show, jay] = await createClients(['hansen', 'show', 'jay'], server);

    await hansen.createRoom('room1');
    await hansen.getMessagesFromServer;
    const roomId = hansen.getRoomId();

    await joinRoom([show, jay], roomId);
    await ready([hansen, show, jay]);


    // 開始遊戲
    await hansen.startGameForTest(false, false, ["T1", "T2", "T3", "T3", "T3", "HS1"]);
    await waitSeconds(2);

    // await hansen.makeChoiceForTest(Choice.KeepGoing)
    // await show.makeChoiceForTest(Choice.KeepGoing)
    // await jay.makeChoiceForTest(Choice.Quit)

    // await hansen.makeChoiceForTest(Choice.KeepGoing)
    // await show.makeChoiceForTest(Choice.KeepGoing)

    // await hansen.makeChoiceForTest(Choice.KeepGoing)
    // await show.makeChoiceForTest(Choice.KeepGoing)

    for (let i = 0; i < 5; i++) {
        await hansen.makeChoiceForTest(Choice.Quit)
        await show.makeChoiceForTest(Choice.Quit)
        await jay.makeChoiceForTest(Choice.Quit)
    }

    await jay.getMessagesFromServer;
    // jay.records.forEach(record => {
    //     console.log(JSON.stringify(record, null, 2));
    // })

    await waitSeconds(0.5); // 等房間狀態改變再離開，不然會遇到race condition而被回覆err
    await hansen.leaveRoom();
    await show.leaveRoom();
    await jay.leaveRoom();


})();


async function waitSeconds(num: number) {
    return new Promise(resolve => {
        setTimeout(resolve, num * 1000);
    })
}
