import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { Server } from "socket.io";
import { io, Socket } from "socket.io-client"
import { bootstrap } from "../../index";
import { AppDataSource } from "../../src/Shared_infra/data-source";
import { User } from "../../src/User/infra/User";
import request from 'supertest'
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
    // client2: Socket;

    beforeAll(async () => {
        server = await bootstrap();
        await insertSeedData();
    }, 30000)

    afterAll(async () => {
        client1.close();
    }, 10000);


    test('createRoom', async () => {
        await login(server, client1, 'johndoe', 'password123');

    })
})

async function login(server: any, client1: Socket, username: string, password: string) {
    const res = await request(server).post("/auth/login")
        .send({ username, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('access_token');

    client1 = io(`http://localhost:8000`, {
        auth: {
            token: res.body['access_token']
        }
    });

    await new Promise((resolve: any) => {
        client1.on('connect', resolve);
    });

    const playerId = res.body['access_token'].playerId;
    (client1 as any).id = playerId;
}

async function insertSeedData() {
    const repo = AppDataSource.getRepository(User);
    await repo.createQueryBuilder()
        .insert()
        .into(User)
        .values([
            { username: 'johndoe', passwd: 'password123', email: 'johndoe@example.com' },
            { username: 'janedoe', passwd: 'password456', email: 'janedoe@example.com' },
            { username: 'bobsmith', passwd: 'password789', email: 'bobsmith@example.com' }
        ])
        .execute();
}