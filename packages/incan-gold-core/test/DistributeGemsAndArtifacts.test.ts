import { artifactCards } from '../src/constant/CardInfo';
import { Choice } from '../src/constant/Choice';
import { DistributeGemsAndArtifactsToExplorersEvent } from '../src/events/DistributeGemsAndArtifactsToExplorersEvent'
import { setupIncanGold, putCardInTunnel } from './Utils/TestUtils';

describe('玩家選擇結束後，分配寶石&神器', () => {

    it(`僅1名玩家選擇回家,寶石、神器全拿`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2']);
        putCardInTunnel(["T3", "T5(1)", "A1"], game);
        game.makeChoice('1', Choice.KeepGoing).next();
        const iterator = game.makeChoice('2', Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() 
        const event: DistributeGemsAndArtifactsToExplorersEvent = iterator.next().value;

        // then 
        const { leavingExplorerIds, artifactsInBag, gemsInBag, numberOfGemsOnCard } = event.data;
        expect(artifactsInBag[0]).toBe(artifactCards["A1"].name);
        expect(!numberOfGemsOnCard).toBe(false);
        expect(leavingExplorerIds[0]).toBe('2');
        expect(gemsInBag).toBe(5);
    })

    it(`多名玩家選擇回家，寶石平分，神器留在通道中`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2']);
        putCardInTunnel(["T3", "T5(1)", "A1"], game);
        game.makeChoice('1', Choice.Quit).next();
        const iterator = game.makeChoice('2', Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() 
        const event: DistributeGemsAndArtifactsToExplorersEvent = iterator.next().value;

        // then 
        const { leavingExplorerIds, artifactsInBag, gemsInBag, numberOfGemsOnCard } = event.data;
        expect(artifactsInBag.length).toBe(0);
        expect(leavingExplorerIds).toEqual(['1', '2']);
        expect(gemsInBag).toBe(4);

    })

    it(`多名玩家選擇回家，寶石數對人數除不盡會留在寶物卡上`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2', '3']);
        putCardInTunnel(["T4", "T7(1)", "A1"], game);
        game.makeChoice('1', Choice.Quit).next();
        game.makeChoice('2', Choice.Quit).next();
        const iterator = game.makeChoice('3', Choice.Quit);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() 
        const event: DistributeGemsAndArtifactsToExplorersEvent = iterator.next().value;

        // then 
        const { leavingExplorerIds, artifactsInBag, gemsInBag, numberOfGemsOnCard } = event.data;
        expect(artifactsInBag.length).toBe(0);
        expect(numberOfGemsOnCard["T4"]).toBe(1);
        expect(numberOfGemsOnCard["T7(1)"]).toBe(1);
        expect(leavingExplorerIds).toEqual(['1', '2', '3']);
        expect(gemsInBag).toBe(3);
    })

    it(`所有玩家選擇繼續探險，寶石、神器皆留在通道中`, () => {
        // given 
        const game = setupIncanGold('1', 1, 3, ['1', '2']);
        putCardInTunnel(["T4", "T7(1)", "A1"], game);
        game.makeChoice('1', Choice.KeepGoing).next();
        const iterator = game.makeChoice('2', Choice.KeepGoing);
        iterator.next(); // ExplorerMadeChoiceEvent
        iterator.next(); // AllExplorersMadeChoiceEvent

        // when game.getAndGo() 
        const event: DistributeGemsAndArtifactsToExplorersEvent = iterator.next().value;

        // then 
        const { leavingExplorerIds, artifactsInBag, gemsInBag, numberOfGemsOnCard } = event.data;
        expect(artifactsInBag.length).toBe(0);
        expect(numberOfGemsOnCard["T7(1)"]).toBe(1);
        expect(leavingExplorerIds.length).toEqual(0);
        expect(gemsInBag).toBe(0);
    })

})
