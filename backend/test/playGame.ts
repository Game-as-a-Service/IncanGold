import { io, Socket } from "socket.io-client"
import { bootstrap } from "../index";
import request from 'supertest'
import jwt from 'jsonwebtoken';
import { start } from "repl";
import { Choice } from "../src/IncanGold/domain/IncanGold";

(async () => {
    // 建立連線
    const server = await bootstrap();
    const client1 = await establishConnection('johndoe');
    const client2 = await establishConnection('tke47');
    const client3 = await establishConnection('Jayyy');

    // 對監聽的事件註冊處理函式
    // const sp1 = socketPromise(client1);
    // const sp2 = socketPromise(client2);
    const sp3 = socketPromise(client3);

    // 開房間 + 加入房間 + 準備
    await createRoom(server, 'johndoe', 'room1');
    await joinRoom(server, '123', 'tke47');
    await joinRoom(server, '123', 'Jayyy');

    await ready(server, '123', 'Jayyy')
    await ready(server, '123', 'tke47')
    await ready(server, '123', 'johndoe')

    await waitSeconds(2);

    // 開始遊戲
    await startGame(server, '123', ['johndoe', 'tke47', 'Jayyy']);
    await enforcePlayerChoicesUseCase(server, '123', 3, 2);
    // await enforcePlayerChoicesUseCase(server, '123', 3, 2);
    // await enforcePlayerChoicesUseCase(server, '123', 3, 2);
    await waitSeconds(2);
    await makeChoice(server, '123', 'johndoe', Choice.KeepGoing)
    // await makeChoice(server, '123', 'tke47', Choice.KeepGoing)
    // await makeChoice(server, '123', 'Jayyy', Choice.Quit)

    // 確保socket處理函式有被執行
    // await Promise.all([sp1, sp2, sp3])
    await Promise.all([sp3])

})();

async function enforcePlayerChoicesUseCase(server: any, roomId: string, round:number, turn:number) {
    await request(server).patch(`/games/${roomId}/enforceChoices`)
        .send({ round,turn });
}

async function startGame(server: any, roomId: string, playerIds: string[]) {
    await request(server).post(`/rooms/${roomId}/start`);
        // .send({ playerIds });
}

async function makeChoice(server: any, roomId: string, explorerId: string, choice: string) {
    await request(server).patch(`/games/${roomId}/choice`)
        .send({ explorerId, choice });
}

async function createRoom(server: any, userId: string, roomName: string) {
    const res = await request(server).post("/rooms")
        .send({ playerId: userId, roomName });
}

async function joinRoom(server: any, roomId: string, userId: string) {
    await request(server).post(`/rooms/${roomId}/players`)
        .send({ playerId: userId });
}

async function ready(server: any, roomId: string,userId: string) {
    await request(server).patch(`/rooms/${roomId}/ready`)
        .send({ playerId: userId });
}

async function establishConnection(userId: string) {
    const JWT_SECRET = 'secret';
    const token = jwt.sign({ userId }, JWT_SECRET);
    const client = io(`http://localhost:8000`, { auth: { token } });
    await new Promise((resolve: any) => client.on('connect', resolve));
    return client;
}

function socketPromise(client: Socket) {
    let socketCallback: (obj) => void;
    // This Promise does *not resolve itself*, it requires socketCallback to be called *externally* to resolve it.
    const socketPromise = new Promise((resolve: (obj) => void) => (socketCallback = resolve));
    // Once Socket.io receives the message event, it executes the listener function, which calls socketCallback.
    client.on('message', (msg: any) => {
        console.log('on Message :\n', msg.events )
        console.log('client : ', client.id);
        socketCallback(msg);
    });
    // This binds the message event to the Promise.
    // Return the Promise, so that it can be awaited.
    return socketPromise;
}

async function waitSeconds(num:number){
    return new Promise(resolve=>{
        setTimeout(resolve,num*1000);
    })
}
