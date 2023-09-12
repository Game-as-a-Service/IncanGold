import { describe, it, expect } from 'vitest';
import { Choice, RoundEndEvent } from '../../../src/IncanGold/domain/IncanGold';
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils';

describe('', () => {

    it("通道中沒有玩家，回合結束", () => {
        // given
        const game = setupIncanGold('1', 3, 3, ['1', '2']);
        putCardInTunnel(["T7(1)", "A1", "HF1"], game);
        game.makeChoice('1', Choice.Quit).next();
        const iterator = game.makeChoice('2', Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToExplorersEvent
        iterator.next(); // TurnEndEvent

        // when 通道中沒有玩家就結束回合 (詳見 IncanGold::*endTurn)
        const event: RoundEndEvent = iterator.next().value;

        // then 新Round，第1Turn
        const { round } = event.data;
        expect(event.name).toBe('RoundEnd');
        expect(round).toBe(3);
    })

    it("通道中有玩家，回合繼續", () => {
        // given
        const game = setupIncanGold('1', 3, 3, ['1', '2']);
        putCardInTunnel(["T7(1)", "A1", "HF1"], game);
        game.makeChoice('1', Choice.Quit).next();
        const iterator = game.makeChoice('2', Choice.KeepGoing);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToExplorersEvent
        iterator.next(); // TurnEndEvent

        // when 通道中有玩家就開始新一Turn (詳見 IncanGold::*endTurn)
        const event = iterator.next().value;

        // then 同Round，新Turn開始
        expect(event.name.startsWith('NewTurn')).toBe(true);
    })
})

