import { test, describe, beforeAll, afterAll, expect, } from "vitest";
import { randomString } from "./Utils";
import { bootstrap } from "../../index";
import { Server } from "http";
import request from "supertest";

describe('User registration', async () => {
    let server: Server;
    const name = randomString(5);
    const data = { username: name, password: 'password123', email: name + '@example.com' };

    beforeAll(async () => {
        await bootstrap.start();
        server = bootstrap.httpServer;
    }, 30000)

    afterAll(async () => {
        bootstrap.close();
    }, 30000)

    test('register a new user', async () => {
        const res = await request(server).post("/users/register").send(data);

        const { username, email } = res.body;
        expect(username).toBe(data.username);
        expect(email).toBe(data.email);
    })

    test('should not allow registering duplicate username', async () => {
        const res = await request(server).post("/users/register").send(data);

        const { message } = res.body;
        expect(message).toBe("Username already exists");
    })

    test('should not allow registering duplicate email', async () => {
        const { email, password } = data;
        const username = randomString(5);

        const res = await request(server).post("/users/register")
            .send({ username, password, email });

        const { message } = res.body;
        expect(message).toBe("Email already exists");
    })

    test('validate required fields on register', async () => {
        const { password, email } = data;
        const res = await request(server).post("/users/register").send({ password, email });

        const { message } = res.body;
        expect(message).toBe("Missing required fields");
    })
})



