import { describe, expect, it } from 'vitest';
import { TreasureCard, NewTurnTreasureCardTriggeredEvent } from '../../../src/IncanGold/domain/IncanGold';
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('寶物卡將寶石平分給通道中的玩家', () => {

    it(`寶石數對人數除的盡`, () => {
        // given 
        const game = setupIncanGold('1', 1, 1, ['1', '2', '3']);
        game.tunnel.appendCard(new TreasureCard("T9"));

        // when 寶物卡(9)平分寶石
        const event = game.tunnel.lastCard.trigger(game);

        // then 
        const { numberOfGemsInBag, numberOfGemsOnCard }
            = (<NewTurnTreasureCardTriggeredEvent>event).data;
        expect(numberOfGemsInBag).toBe(3);
        expect(numberOfGemsOnCard).toBe(0);
    })

    it(`寶石數對人數除不盡`, () => {
        // given 
        const game = setupIncanGold('1', 1, 1, ['1', '2', '3']);
        game.tunnel.appendCard(new TreasureCard("T11(1)"));

        // when 寶物卡(11)平分寶石
        const event = game.tunnel.lastCard.trigger(game);

        // then 
        const { numberOfGemsInBag, numberOfGemsOnCard }
            = (<NewTurnTreasureCardTriggeredEvent>event).data;
        expect(numberOfGemsInBag).toBe(3);
        expect(numberOfGemsOnCard).toBe(2);
    })

    it(`放置寶物卡時，只平分這張卡上的寶石：`, () => {
        // given 
        const game = setupIncanGold('1', 1, 2, ['1', '2']);
        putCardInTunnel(["T1"], game)
        const { tunnel } = game;
        tunnel.appendCard(new TreasureCard("T4"));

        // when 寶物卡(4)平分寶石
        const event = game.tunnel.lastCard.trigger(game);

        // then 
        const { numberOfGemsInBag, numberOfGemsOnCard }
            = (<NewTurnTreasureCardTriggeredEvent>event).data;
        const { numOfGems } = tunnel.lastCard as TreasureCard;
        expect(numberOfGemsInBag).toBe(2);
        expect(numberOfGemsOnCard).toBe(0);
        expect(numOfGems).toBe(0);
    })
})
