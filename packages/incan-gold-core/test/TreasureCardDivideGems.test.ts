import { describe,expect,it } from 'vitest';
import TreasureCard from '../src/entities/Card/TreasureCard';
import { NewTurnTreasureCardTriggeredEvent } from "../src/events/NewTurnCardTriggeredEvent";
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('寶物卡將寶石平分給通道中的玩家', () => {

    it(`寶石數對人數除的盡`, () => {
        // given 
        const game = setupIncanGold('1', 1, 1, ['1', '2', '3']);
        game.tunnel.appendCard(new TreasureCard("T9"));

        // when 寶物卡(9)平分寶石
        const event = <NewTurnTreasureCardTriggeredEvent>(game.tunnel.lastCard.trigger(game));

        // then 
        expect(event.numberOfGemsInBag).toBe(3);
        expect(event.numberOfGemsOnCard).toBe(0);
    })

    it(`寶石數對人數除不盡`, () => {
        // given 
        const game = setupIncanGold('1', 1, 1, ['1', '2', '3']);
        game.tunnel.appendCard(new TreasureCard("T11(1)"));

        // when 寶物卡(11)平分寶石
        const event = <NewTurnTreasureCardTriggeredEvent>(game.tunnel.lastCard.trigger(game));

        // then 
        expect(event.numberOfGemsInBag).toBe(3);
        expect(event.numberOfGemsOnCard).toBe(2);
    })

    it(`放置寶物卡時，只平分這張卡上的寶石：`, () => {
        // given 
        const game = setupIncanGold('1', 1, 2, ['1', '2']);
        putCardInTunnel(["T1"],game)
        game.tunnel.appendCard(new TreasureCard("T4"));

        // when 寶物卡(4)平分寶石
        const event = <NewTurnTreasureCardTriggeredEvent>(game.tunnel.lastCard.trigger(game));

        // then 
        expect(event.numberOfGemsInBag).toBe(2);
        expect(event.numberOfGemsOnCard).toBe(0);
        expect((<TreasureCard>game.tunnel.cards[0]).numOfGems).toBe(1);
    })
})
