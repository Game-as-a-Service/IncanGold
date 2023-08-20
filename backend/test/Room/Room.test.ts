import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { io, Socket } from "socket.io-client"
import { bootstrap } from "../../index";
import request from 'supertest'
import jwt from 'jsonwebtoken';

describe('create Room', async () => {
    let client1: Socket;
    let client2: Socket;
    let server;

    beforeAll(async () => {
        server = await bootstrap();
        client1 = await establishConnection('johndoe');
        client2 = await establishConnection('tke47');
    }, 30000)

    afterAll(async () => {
        client1.close();
        client2.close();
    }, 10000);


    test('createRoom', async () => {
        const sp1 = socketPromise(client1);
        const sp2 = socketPromise(client2);
        await createRoom(server, 'johndoe', 'room1');
        await joinRoom(server, 'tke47');
        await ready(server, 'tke47');
        await cancelReady(server, 'tke47');
        await changeHost(server, 'tke47');
        await setName(server, "room2");
        await setPassword(server, "passwd123");
        await lockSeat(server, 3);
        await unlockSeat(server, 3);
        await leaveRoom(server, 'tke47');
        // await sp2;
        await Promise.all([sp1, sp2]);
    })
})

async function createRoom(server: any, userId: string, roomName: string) {
    const res = await request(server).post("/rooms")
        .send({ playerId: userId, roomName });

    console.log('todo: supplement sentences with expect. Now, just print result.')
    console.log(res.body);
}

async function joinRoom(server: any, userId: string) {
    const roomId = '123';
    await request(server).post(`/rooms/${roomId}/players`)
        .send({ playerId: userId });
}

async function leaveRoom(server: any, userId: string) {
    const roomId = '123';
    await request(server).delete(`/rooms/${roomId}/players/${userId}`)
}

async function ready(server: any, userId: string) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/ready`)
        .send({ playerId: userId });
}

async function cancelReady(server: any, userId: string) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/cancelReady`)
        .send({ playerId: userId });
}

async function lockSeat(server: any, seatNumber: number) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/seats/${seatNumber}/lock`)
}

async function unlockSeat(server: any, seatNumber: number) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/seats/${seatNumber}/unlock`)
}

async function changeHost(server: any, newHostId: string) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/host`)
        .send({ playerId: newHostId })
}

async function setName(server: any, roomName: string) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/name`)
        .send({ roomName })
}

async function setPassword(server: any, password: string) {
    const roomId = '123';
    await request(server).patch(`/rooms/${roomId}/password`)
        .send({ password })
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
        console.log('on Message :\n', msg.events, '\n', msg.room.seats);
        console.log('client : ',client.id);
        socketCallback(msg);
    });
    // This binds the message event to the Promise.
    // Return the Promise, so that it can be awaited.
    return socketPromise;
}