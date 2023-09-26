import { test, describe, beforeAll, expect, beforeEach, afterAll } from "vitest";
import { bootstrap } from "../../index";
import { Client, joinRoom, ready, createClients } from "../Client";
import { Server } from "http";
import { waitSeconds } from "../Client";
import { Choice } from "../../../packages/incan-gold-core";
import { IncanGoldRepository } from "../../src/IncanGold/infra/IncanGoldRepository";
import { RoomRepository } from "../../src/Room/infra/RoomRepository";
import { IncanGoldRouterForFrontendDev } from "../../src/IncanGoldForFrontendDev/api/IncanGold.router";
import { randomString } from "../User/Utils";

describe('...', async () => {
    let client1: Client;
    let client2: Client;
    let client3: Client;
    let server: Server;

    beforeAll(async () => {
        bootstrap.use("/test", IncanGoldRouterForFrontendDev())
        await bootstrap.start();
        server = bootstrap.httpServer;
        [client1, client2, client3] =
            await createClients([randomString(4), randomString(4), randomString(4)], server);

        await client1.createRoom('room1');
        await client1.getMessagesFromServer;
        const roomId = client1.getRoomId();

        await joinRoom([client2, client3], roomId);
        await ready([client1, client2, client3]);
    }, 30000)

    afterAll(async () => {
        bootstrap.close();
    })

    test('After the game ends, the data will be cleared and the room status changes to waiting.', async () => {
        // Given: The game has progressed to the 5th round. 
        // In the current turn, only Player 3 has not chosen yet, 
        // while all other players have chosen to leave.
        await client1.startGameForTest(false, false, ["T1", "T2", "T3", "T5(1)", "T5(2)", "HS1"]);
        await waitSeconds(0.5);

        for (let i = 0; i < 4; i++) {
            await client1.makeChoiceForTest(Choice.Quit)
            await client2.makeChoiceForTest(Choice.Quit)
            await client3.makeChoiceForTest(Choice.Quit)
        }
        await client1.makeChoiceForTest(Choice.Quit)
        await client2.makeChoiceForTest(Choice.Quit)

        const incanGoldRepository = new IncanGoldRepository;
        const game_before = await incanGoldRepository.findById(client1.getRoomId());
        await incanGoldRepository.save(game_before);

        // When: Player 3 chooses to leave.
        await client3.makeChoiceForTest(Choice.Quit)
        await waitSeconds(0.5);

        // Then: The game ends, gets cleared from the database, and the room status changes to "waiting".
        expect(!!game_before).toBe(true);
        const game_after = await incanGoldRepository.findById(client1.getRoomId());
        expect(!!game_after).toBe(false);
        const roomRepository = new RoomRepository;
        const { state } = await roomRepository.findById(client1.getRoomId());
        expect(state).toBe("WAITING");
    })

})