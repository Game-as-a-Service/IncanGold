import { test, describe, beforeAll, expect, beforeEach,afterAll } from "vitest";
import { bootstrap } from "../../index";
import { Client, joinRoom, createClients, ready } from "../Client";
import { Server } from "http";
import e from "express";

describe('Validate the rules related to leaveRoom.', async () => {
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

    test(
        `The seatedOriginally property of the leaveRoom event, 
        indicating whether the player was previously seated.(1)`,
        async () => {
            // Given: There are 2 players in the room, both are seated.
            await client1.createRoom('room1');
            await client1.getMessagesFromServer;
            const roomId = client1.getRoomId();
            await joinRoom([client2], roomId);

            // When: client2 leaves the room.
            await client2.leaveRoom();

            // Then: It shows client2 was originally sitting in a seat.
            await client2.getMessagesFromServer;
            const { events } = client2.records.at(-1);
            const { seatedOriginally } = events.at(-1).data;
            expect(seatedOriginally).toBe(true);
        }
    )

    test(
        `The seatedOriginally property of the leaveRoom event, 
        indicating whether the player was previously seated.(2)`,
        async () => {
            // Given: The room is currently in a game.
            const [client3, client4] = await createClients(["Jay", "Jolin"], server);
            await client1.createRoom('room1');
            await client1.getMessagesFromServer;
            await joinRoom([client2, client3], client1.getRoomId());
            await ready([client1, client2, client3]);
            await client1.startGame();
            await client4.joinRoom(client1.getRoomId());

            // When: client4 leaves the room.
            await client4.leaveRoom()

            // Then: It shows client4 wasn't originally sitting in a seat.
            await client4.getMessagesFromServer;
            const { events } = client4.records.at(-1);
            const { seatedOriginally } = events.at(-1).data;
            expect(seatedOriginally).toBe(false);
        }
    )

    test(
        `When the host leaves the room, 
        automatically make another player the new host.`,
        async () => {
            // Given: Hansen create a room and Show join the room.
            await client1.createRoom('room1');
            await client1.getMessagesFromServer;
            await joinRoom([client2], client1.getRoomId());

            // When: Hansen leaves the room.
            await client1.leaveRoom()

            // Then: Show become the new host of the room.
            await client2.getMessagesFromServer;
            const { room } = client2.records.at(-1);
            expect(room.host).toBe("Show");
        }
    )
})