import { describe, it, expect } from 'vitest';
import { Choice, RoundEndEvent, AllExplorersMadeChoiceEvent, HazardCard } from '../../../src/IncanGold/domain/IncanGold';
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe("災難卡被放入通道", () => {

    it('回合第一張卡為災難卡，玩家只能繼續探險', () => {
        // given 
        const game = setupIncanGold('1', 1, 0, ['1', '2', '3']);
        game.deck.appendCard(new HazardCard("HF1"));
        const iterator = game.startRound();

        // when NewTurnHazardCardTriggered
        iterator.next();

        // then 
        let event: AllExplorersMadeChoiceEvent = iterator.next().value;
        const { allExplorersChoices } = event.data;
        Object.values(allExplorersChoices)
            .forEach(choice => expect(choice).toBe(Choice.KeepGoing));
    })

    it('災難卡種類尚未重複出現,繼續此round', () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1']);
        putCardInTunnel(["HS1", "HP1"], game)
        game.deck.appendCard(new HazardCard("HF1"));

        // when NewTurnHazardCardTriggeredEvent
        game.startTurn().next();

        // then
        expect(game.round).toBe(1) // 依然在第一回合
    })

    it('災難卡種類已重複出現，玩家們皆清空背包、離開通道', () => {
        // given 
        const game = setupIncanGold('1', 1, 4, ['1', '2']);
        putCardInTunnel(["T4", "HS1", "HP1"], game)
        game.deck.appendCard(new HazardCard("HP2"));

        // when 災難卡重複出現
        const iterator = game.startTurn();
        iterator.next();

        // then 玩家們皆回到營地；背包內的資源沒有被加入總分
        game.explorers.forEach(explorer => expect(explorer.inTent).toBe(true));
        game.explorers.forEach(explorer => expect(explorer.points).toBe(0))

        const event: RoundEndEvent = iterator.next().value;
        expect(event.data.discardedCardIds[0]).toBe("HP2");
    })

})