import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { RoomRepository } from "../src/Room/infra/RoomRepository";
import { IncanGoldRepository } from "../src/IncanGold/infra/IncanGoldRepository";
import { UserRepository } from "../src/User/infra/UserRepository";
import { bootstrap } from "../index";
import { Server } from "http";
import request from "supertest";

describe('User login and authentication', async () => {
    let server: Server;

    beforeAll(async () => {
        await bootstrap.start();
        server = bootstrap.httpServer;
    }, 30000)

    afterAll(async () => {
        bootstrap.close();
    }, 30000)

    test('...', async () => {
        const res = await request(server).delete("/rooms/260b8359-51e3-41e0-90a8-8beb96202176");
        console.log(res.body);
    })
})