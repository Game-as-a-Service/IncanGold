import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client"
import { bootstrap } from "../../index";
import { AppDataSource } from "../../src/Shared_infra/data-source";
import { User } from "../../src/User/infra/User";
import request from 'supertest'
import jwt from 'jsonwebtoken';
// import express,{ Express } from "express";
// import { createServer } from "http";


function waitForEvent(client: Socket, eventType: string) {
    return new Promise(resolve => {
        client.on(eventType, resolve);
    });
}



describe('create Room', async () => {
    let client1: Socket;
    let server;

    beforeAll(async () => {
        server = await bootstrap();
    }, 30000)

    // afterAll(async () => {
    //     client1.close();
    // }, 10000);


    test('createRoom', async () => {
        await createRoom(server, client1, 'johndoe', 'room1');

    })
})

async function createRoom(server: any, client1: Socket, userId: string, roomName: string) {
    const JWT_SECRET = 'secret'
    const token = jwt.sign({ userId }, JWT_SECRET);

    client1 = io(`http://localhost:8000`, {
        auth: { token }
    });

    await new Promise((resolve: any) => {
        client1.on('connect', resolve);
    });

    const res = await request(server).post("/rooms")
        .send({ playerId: userId, roomName });

    console.log('todo: supplement sentences with expect. Now, just print result.')
    console.log(res.body);
}
