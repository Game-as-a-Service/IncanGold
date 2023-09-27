import { test, describe, beforeAll, expect, beforeEach, afterAll, } from "vitest";
import { bootstrap } from "../../index";
import { Client, joinRoom, createClients, ready } from "../Client";
import { Server } from "http";

describe('Validate the rules related to lockSeat.', async () => {
    let client1: Client;
    let client2: Client;
    let server: Server;

    beforeAll(async () => {
        await bootstrap.start();
        server = bootstrap.httpServer;
    }, 30000)

    afterAll(async () => {
        bootstrap.close();
    })

    beforeEach(async () => {
        client1 = new Client("Hansen", server);
        client2 = new Client("Show", server);
        const promiseArr = [client1, client2].map(client => client.establishConnection());
        await Promise.all(promiseArr);
    }, 30000)

    test(
        `If there are only 3 seats left unlocked in the room, 
        then any attempt to lock additional seats will fail.`,
        async () => {
            // Given: there are only 3 seats left unlocked in the room.
            await client1.createRoom('room1');
            await client1.getMessagesFromServer;
            const roomId = client1.getRoomId();
            await joinRoom([client2], roomId);
            for (const i of [3, 4, 5, 6, 7]) 
                await client1.lockSeat(i);

            // When: client1 locks a seat#8.
            await client1.lockSeat(8);

            // Then: Lock failed.
            await client1.getMessagesFromServer;
            const { events } = client1.records.at(-1);
            expect(events.at(-1).type).toBe("Lock failed");
        }
    )

})