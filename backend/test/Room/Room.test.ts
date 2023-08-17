import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client"
import { bootstrap } from "../../index";
import { AppDataSource } from "../../src/Shared_infra/data-source";
import { User } from "../../src/User/infra/User";
import request from 'supertest'
import jwt from 'jsonwebtoken';

describe('create Room', async () => {
    let client1: Socket;
    let client2: Socket;
    let server;

    beforeAll(async () => {
        server = await bootstrap();
    }, 30000)

    afterAll(async () => {
        // client1.close();
        // client2.close();
    }, 10000);


    test('createRoom', async () => {
        await createRoom(server, client1, 'johndoe', 'room1');
        await joinRoom(server, client2, 'tke47');
    })
})

async function createRoom(server: any, client: Socket, userId: string, roomName: string) {
    client = establishConnection(userId, client); 

    await new Promise((resolve: any) => {
        client.on('connect', resolve);
    });

    const res = await request(server).post("/rooms")
        .send({ playerId: userId, roomName });

    console.log('todo: supplement sentences with expect. Now, just print result.')
    console.log(res.body);
}

async function joinRoom(server: any, client: Socket, userId: string) {
    client = establishConnection(userId, client); 

    await new Promise((resolve: any) => {
        client.on('connect', resolve);
    });

    const roomId = '123';
    await request(server).post(`/rooms/${roomId}/players`)
        .send({ playerId: userId });

    const message = await new Promise((resolve: (obj:any)=>void ) => {
        client.on('message', resolve);
    });
    console.log('room.test joinRoom 60: ', message);
}

function establishConnection(userId: string, client:Socket) {
    const JWT_SECRET = 'secret';
    const token = jwt.sign({ userId }, JWT_SECRET);
    client = io(`http://localhost:8000`, {
        auth: { token }
    });
    return client;
}