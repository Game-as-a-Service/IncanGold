import { test, describe, beforeAll, expect, beforeEach,afterAll } from "vitest";
import { bootstrap } from "../../index";
import { Client, joinRoom, ready, createClients } from "../Client";
import { Server } from "http";

describe('Validate the rules related to starting the game', async () => {
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

    test('A minimum of 3 players must be present in the room to start the game.', async () => {
        // Given: There are 2 players total in the room, both are ready.
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        const roomId = client1.getRoomId();
        await joinRoom([client2], roomId);
        await ready([client1, client2]);

        // When: The host starts the game.
        await client1.startGame()

        // Then: The game cannot be started.
        await client2.getMessagesFromServer;
        const { events } = client2.records.at(-1);
        const { type: eventType } = events.at(-1);
        expect(eventType).toBe("can't StartGame");
    })

    test('The game can only be started after all players are ready.(1)', async () => {
        // Given: There are 4 players total in the room, only p4 is not ready.
        const [client3, client4] = await createClients(["Jay", "Jolin"], server)
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        await joinRoom([client2, client3, client4], client1.getRoomId());
        await ready([client1, client2, client3]);

        // When: The host starts the game.
        await client1.startGame();

        // Then: The game cannot be started.
        await client4.getMessagesFromServer;
        const { events } = client4.records.at(-1);
        const { type: eventType } = events.at(-1);
        expect(eventType).toBe("can't StartGame");
    })

    test('The game can only be started after all players are ready.(2)', async () => {
        // Given: There are 4 players total in the room, all are ready.
        const [client3, client4] = await createClients(["Jay", "Jolin"], server)
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        await joinRoom([client2, client3, client4], client1.getRoomId());
        await ready([client1, client2, client3, client4]);

        // When: The host starts the game.
        await client1.startGame();

        // Then: The game cannot be started.
        await client4.getMessagesFromServer;
        const { events } = client4.records.at(-1);
        const { type: eventType } = events.at(-1);
        expect(eventType).toBe("startGame");
    })

    test('If there are at least 3 players and all of them are ready, the game can be started.', async () => {
        // Given: There are 3 players total in the room, only p3 is not ready.
        const [client3] = await createClients(["Jay"], server)
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        await joinRoom([client2, client3], client1.getRoomId());
        await ready([client1, client2]);

        // When: P3 is ready.
        await client3.ready();

        // Then: The game can be started.
        await client3.getMessagesFromServer;
        const { room } = client3.records.at(-1);
        const { canStartGame } = room;
        expect(canStartGame).toBe(true);
    })

    test(
        `If the room was previously ready to start the game,
        but a player cancelled ready, 
        then the game can't be started in that room.`,
        async () => {
            // Given: There are 3 players total in the room,all are ready.
            const [client3] = await createClients(["Jay"], server)
            await client1.createRoom('room1');
            await client1.getMessagesFromServer;
            await joinRoom([client2, client3], client1.getRoomId());
            await ready([client1, client2, client3]);

            // When: P3 cancels ready.
            await client3.cancelReady();

            // Then: The game cannot be started.
            await client3.getMessagesFromServer;

            const { room: lastRoom } = client3.records.at(-2);
            const { canStartGame: lastCanStartGame } = lastRoom;
            expect(lastCanStartGame).toBe(true);

            const { room } = client3.records.at(-1);
            const { canStartGame } = room;
            expect(canStartGame).toBe(false);
        }
    )

    test('A room that is currently in a game cannot start another game.', async () => {
        // Given: A room that is currently in a game.
        const [client3] = await createClients(["Jay"], server);
        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        await joinRoom([client2, client3], client1.getRoomId());
        await ready([client1, client2, client3]);
        await client1.startGame();

        // When: startGame again.
        await client1.startGame();

        // Then: The game cannot be started.
        await client3.getMessagesFromServer;
        const { events } = client3.records.at(-1);
        const { type } = events.at(-1);
        expect(type).toBe("can't StartGame");
    })
})