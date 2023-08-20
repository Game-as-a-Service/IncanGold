import { artifactCards } from '../src/constant/CardInfo';
import { Choice } from '../src/constant/Choice';
import DistributeGemsAndArtifactsToExplorersEvent from '../src/events/DistributeGemsAndArtifactsToExplorersEvent'
import { setupIncanGold,putCardInTunnel,showTunnel } from './Utils/TestUtils';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('玩家選擇結束後，分配寶石&神器', () => {

    it(`僅1名玩家選擇回家,寶石、神器全拿`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2']);
        putCardInTunnel(["T3","T5(1)","A1"],game);
        game.makeChoice(game.explorersInTunnel[0], Choice.KeepGoing).next();
        const iterator = game.makeChoice(game.explorersInTunnel[1], Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() // DistributeGemsAndArtifactsToExplorersEvent
        const event = <DistributeGemsAndArtifactsToExplorersEvent>iterator.next().value;

        // then 
        expect(event.artifactsInBag[0]).toBe(artifactCards["A1"].name);
        expect(!event.numberOfGemsOnCard).toBe(false);
        expect(event.leavingExplorersID[0]).toBe('2');
        expect((event.numberOfGemsInLeavingExplorerBag)).toBe(5);
    })


    it(`多名玩家選擇回家，寶石平分，神器留在通道中`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2']);
        putCardInTunnel(["T3","T5(1)","A1"],game);
        game.makeChoice(game.explorersInTunnel[0], Choice.Quit).next();
        const iterator = game.makeChoice(game.explorersInTunnel[1], Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() // DistributeGemsAndArtifactsToExplorersEvent
        const event = <DistributeGemsAndArtifactsToExplorersEvent>iterator.next().value;

        // then 
        expect(event.artifactsInBag.length).toBe(0);
        expect(!event.numberOfGemsOnCard).toBe(false);
        expect(event.leavingExplorersID).toEqual(['1', '2']);
        expect((event.numberOfGemsInLeavingExplorerBag)).toBe(4);

    })

    it(`多名玩家選擇回家，寶石數對人數除不盡會留在寶物卡上`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2','3']);
        putCardInTunnel(["T4","T7(1)","A1"],game);
        game.makeChoice(game.explorersInTunnel[0], Choice.Quit).next();
        game.makeChoice(game.explorersInTunnel[1], Choice.Quit).next();
        const iterator = game.makeChoice(game.explorersInTunnel[2], Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() // DistributeGemsAndArtifactsToExplorersEvent
        const event = <DistributeGemsAndArtifactsToExplorersEvent>iterator.next().value;
        showTunnel(game);

        // then 
        expect(event.artifactsInBag.length).toBe(0);
        expect(event.numberOfGemsOnCard[4]).toBe(1);
        expect(event.numberOfGemsOnCard[7]).toBe(1);
        expect(event.leavingExplorersID).toEqual(['1', '2', '3']);
        expect((event.numberOfGemsInLeavingExplorerBag)).toBe(3);
    })

    it(`所有玩家選擇繼續探險，寶石、神器皆留在通道中`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2']);
        putCardInTunnel(["T4","T7(1)","A1"],game);
        game.makeChoice(game.explorersInTunnel[0], Choice.KeepGoing).next();
        const iterator = game.makeChoice(game.explorersInTunnel[1], Choice.KeepGoing);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent


        // when game.getAndGo() // DistributeGemsAndArtifactsToExplorersEvent
        const event = <DistributeGemsAndArtifactsToExplorersEvent>iterator.next().value;
        showTunnel(game);

        // then 
        expect(event.artifactsInBag.length).toBe(0);
        expect(event.numberOfGemsOnCard[7]).toBe(1);
        expect(event.leavingExplorersID).toEqual([]);
        expect((event.numberOfGemsInLeavingExplorerBag)).toBe(0);
    })

})
