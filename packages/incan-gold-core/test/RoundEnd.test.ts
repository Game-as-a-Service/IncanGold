import { describe, expect, it } from 'vitest';
import { Choice } from '../src/constant/Choice';
import { GameOverEvent } from '../src/events/GameOverEvent'
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils'
import { EventName } from '../src/constant/EventName';

describe("當遊戲回合結束時,遊戲檢查回合數,並結算勝負or把通道中的卡洗回牌堆", () => {

    it("遊戲回合數等於 5 , 結算勝負", () => {
        // given
        const game = setupIncanGold('1', 5, 3, ['1', '2']);
        putCardInTunnel(['T7(1)', 'A1', 'HF1'], game);

        game.makeChoice('1', Choice.Quit).next();
        const iterator = game.makeChoice('2', Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToExplorersEvent
        iterator.next(); // TurnEndEvent
        iterator.next(); // RoundEndEvent

        // when 回合數超過5，遊戲結束 (詳見 IncanGold::*endRound)
        const event:GameOverEvent = iterator.next().value;

        // then 遊戲結束
        expect(event.name).toBe(EventName.GameOver);
    })

    it("遊戲回合數不等於 5 , 開始新回合新turn˙", () => {
        const game = setupIncanGold('1', 4, 3, ['1', '2']);
        putCardInTunnel(['T7(1)', 'A1', 'HF1'], game);

        game.makeChoice('1', Choice.Quit).next();
        const iterator = game.makeChoice('2', Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToExplorersEvent
        iterator.next(); // TurnEndEvent
        iterator.next(); // RoundEndEvent

        // when 回合數未超過5，遊戲繼續 (詳見 IncanGold::*endRound)
        const event = iterator.next().value;

        // then 新Round，新Turn開始
        expect(event.name.startsWith("NewTurn")).toBe(true);
        expect(game.round).toBe(5);
    })

})