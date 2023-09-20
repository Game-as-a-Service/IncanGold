import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { randomString } from "./Utils";
import { bootstrap } from "../../index";
import { Server } from "http";
import request from "supertest";

describe('User login and authentication', async () => {
    let server: Server;
    let userId: string;
    const name = randomString(5);
    const data = { username: name, password: 'password123', email: name + '@example.com' };

    beforeAll(async () => {
        await bootstrap.start();
        server = bootstrap.httpServer;

        const res = await request(server).post("/users/register").send(data);
        userId = res.body.id;
    }, 30000)

    afterAll(async () => {
        bootstrap.close();
    }, 30000)

    test('login and retrieve user information with JWT token', async () => {
        const { username, password } = data;
        const res = await request(server).post("/users/login")
            .send({ username, password });

        const { token } = res.body;
        const res2 = await request(server).get('/users')
            .set('Authorization', `Bearer ${token}`)

        const { body } = res2;
        expect(body.id).toBe(userId);
        expect(body.username).toBe(username);
        expect(body.email).toBe(data.email);
    })
})