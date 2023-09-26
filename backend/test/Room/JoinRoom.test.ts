import { test, describe, beforeAll, expect, beforeEach, afterAll } from "vitest";
import { bootstrap } from "../../index";
import { Client, joinRoom, createClients, ready } from "../Client";
import { Server } from "http";

describe('Validate the rules related to joinRoom.', async () => {
    let client1: Client;
    let client2: Client;
    let server: Server;

    beforeAll(async () => {
        await bootstrap.start();
        server = bootstrap.httpServer;
    }, 30000)

    beforeEach(async () => {
        client1 = new Client("Hansen", server);
        client2 = new Client("Show", server);
        const promiseArr = [client1, client2].map(client => client.establishConnection());
        await Promise.all(promiseArr);
    }, 30000)

    afterAll(async () => {
        bootstrap.close();
    })

    test('If all seats are taken, no more players can sit down.', async () => {
        // Given: All 8 seats in the room are occupied by players.
        const clients = await createClients(['p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',], server);
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        const roomId = client1.getRoomId();
        const p9 = clients.pop();
        await joinRoom([client2, ...clients], roomId);

        // When: p9 enters the room.
        await p9.joinRoom(roomId);

        // Then: p9 doesn't have an available seat.
        await p9.getMessagesFromServer;
        const { events } = p9.records.at(-1);
        const { seated } = events.at(-1).data;
        expect(seated).toBe(false);
    })

    test('If room is currently in a game, players entering the room cannot take a seat.', async () => {
        // Given: The room is currently in a game
        const [client3, client4] = await createClients(["Jay", "Jolin"], server);
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        await joinRoom([client2, client3], client1.getRoomId());
        await ready([client1, client2, client3]);
        await client1.startGame();

        // When: client4 enters the room.
        await client4.joinRoom(client1.getRoomId());

        // Then: client4 cannot take a seat.
        await client4.getMessagesFromServer;
        const { events } = client4.records.at(-1);
        const { seated } = events.at(-1).data;
        expect(seated).toBe(false);
    })
})