import { Choice } from '../src/constant/Choice';
import RoundEndEvent from '../src/events/RoundEndEvent';
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('', () => {

    it("通道中沒有玩家，回合結束", () => {
        // given
        const game = setupIncanGold('1', 3, 3, ['1', '2']);
        putCardInTunnel(["T7(1)", "A1", "HF1"], game);
        game.makeChoice(game.explorersInTunnel[0], Choice.Quit).next();
        const iterator = game.makeChoice(game.explorersInTunnel[1], Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToExplorersEvent
        iterator.next(); // new Event('TurnEnd');

        // when 通道中沒有玩家就結束回合 (詳見 IncanGold::*endTurn)
        const event = <RoundEndEvent>iterator.next().value;

        // then 新Round，第1Turn
        expect(event.name).toBe('RoundEnd');
    })

    it("通道中有玩家，回合繼續", () => {
        // given
        const game = setupIncanGold('1', 3, 3, ['1', '2']);
        putCardInTunnel(["T7(1)", "A1", "HF1"], game);
        game.makeChoice(game.explorersInTunnel[0], Choice.Quit).next();
        const iterator = game.makeChoice(game.explorersInTunnel[1], Choice.KeepGoing);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToExplorersEvent
        iterator.next(); // new Event('TurnEnd');

        // when 通道中有玩家就開始新一Turn (詳見 IncanGold::*endTurn)
        const event = <RoundEndEvent>iterator.next().value;
        console.log(event);

        // then 同Round，新Turn開始
        expect((/^NewTurn.+/).test(event.name)).toBe(true);
    })
})

