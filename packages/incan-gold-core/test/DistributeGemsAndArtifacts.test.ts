import IncanGold from '../src/domain/entities/IncanGold';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import { artifactName,artifactPoints } from '../src/domain/constant/CardInfo';
import { Choice } from '../src/domain/constant/Choice';
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import DistributeGemsAndArtifactsToPlayersEvent from '../src/domain/events/DistributeGemsAndArtifactsToPlayersEvent'

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('玩家選擇結束後，分配寶石&神器', ()=>{

    it(`僅1名玩家選擇回家,寶石、神器全拿`,()=>{
        // given 
        const game = new IncanGold('1',['1','2']);
        game.makePlayersEnterTunnel();
        game.round = 1;
        game.tunnel.appendCard(new TreasureCard("T3",3));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new TreasureCard("T5(1)",5));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new ArtifactCard("A1",artifactName[1],artifactPoints[1]));
        game.tunnel.lastCard.trigger(game);
        game.makeChoice(game.playersInTunnel[0], Choice.KeepGoing).next();
        const iterator = game.makeChoice(game.playersInTunnel[1], Choice.Quit);
        iterator.next(); // PlayerMadeChoiceEvent
        iterator.next(); // AllPlayersMadeChoiceEvent

        // when game.getAndGo() // DistributeGemsAndArtifactsToPlayersEvent
        const event = <DistributeGemsAndArtifactsToPlayersEvent>iterator.next().value; 

        // then 
        expect(event.artifactsInBag[0]).toBe(artifactName[1]); 
        expect(!event.numberOfGemsOnCard).toBe(false);
        expect(event.leavingplayersID[0]).toBe('2');
        expect((event.numberOfGemsInLeavingplayersBag)).toBe(5);
    })
    

    it(`多名玩家選擇回家，寶石平分，神器留在通道中`,()=>{
        // given 
        const game = new IncanGold('1',['1','2']);
        game.makePlayersEnterTunnel();
        game.round = 1;
        game.tunnel.appendCard(new TreasureCard("T3",3));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new TreasureCard("T5(1)",5));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new ArtifactCard("A1",artifactName[1],artifactPoints[1]));
        game.tunnel.lastCard.trigger(game);
        game.makeChoice(game.playersInTunnel[0], Choice.Quit).next();
        const iterator = game.makeChoice(game.playersInTunnel[1], Choice.Quit);
        iterator.next(); // PlayerMadeChoiceEvent
        iterator.next(); // AllPlayersMadeChoiceEvent
        
        // when game.getAndGo() // DistributeGemsAndArtifactsToPlayersEvent
        const event = <DistributeGemsAndArtifactsToPlayersEvent>iterator.next().value;

        // then 
        expect(event.artifactsInBag.length).toBe(0); 
        expect(!event.numberOfGemsOnCard).toBe(false);
        expect(event.leavingplayersID).toEqual(['1','2']);
        expect((event.numberOfGemsInLeavingplayersBag)).toBe(4);

    })

    it(`多名玩家選擇回家，寶石數對人數除不盡會留在寶物卡上`,()=>{
        // given 
        const game = new IncanGold('1',['1','2','3']);
        game.makePlayersEnterTunnel();
        game.round = 1;
        game.tunnel.appendCard(new TreasureCard("T4",4));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new TreasureCard("T7(1)",7));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new ArtifactCard("A1",artifactName[1],artifactPoints[1]));
        game.tunnel.lastCard.trigger(game);
        game.makeChoice(game.playersInTunnel[0], Choice.Quit).next();
        game.makeChoice(game.playersInTunnel[1], Choice.Quit).next();
        const iterator = game.makeChoice(game.playersInTunnel[2], Choice.Quit);
        iterator.next(); // PlayerMadeChoiceEvent
        iterator.next(); // AllPlayersMadeChoiceEvent

        // when game.getAndGo() // DistributeGemsAndArtifactsToPlayersEvent
        const event = <DistributeGemsAndArtifactsToPlayersEvent>iterator.next().value;
        showTunnel(game);

        // then 
        expect(event.artifactsInBag.length).toBe(0); 
        expect(event.numberOfGemsOnCard[4]).toBe(1);
        expect(event.numberOfGemsOnCard[7]).toBe(1);
        expect(event.leavingplayersID).toEqual(['1','2','3']);
        expect((event.numberOfGemsInLeavingplayersBag)).toBe(3);
    })

    it(`所有玩家選擇繼續探險，寶石、神器皆留在通道中`,()=>{
        // given 
        const game = new IncanGold('1',['1','2']);
        game.makePlayersEnterTunnel();
        game.round = 1;
        game.tunnel.appendCard(new TreasureCard("T4",4));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new TreasureCard("T7(1)",7));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new ArtifactCard("A1",artifactName[1],artifactPoints[1]));
        game.tunnel.lastCard.trigger(game);
        game.makeChoice(game.playersInTunnel[0], Choice.KeepGoing).next();
        const iterator = game.makeChoice(game.playersInTunnel[1], Choice.KeepGoing);
        iterator.next(); // PlayerMadeChoiceEvent
        iterator.next(); // AllPlayersMadeChoiceEvent

        
        // when game.getAndGo() // DistributeGemsAndArtifactsToPlayersEvent
        const event = <DistributeGemsAndArtifactsToPlayersEvent>iterator.next().value;
        showTunnel(game);

        // then 
        expect(event.artifactsInBag.length).toBe(0); 
        expect(event.numberOfGemsOnCard[7]).toBe(1);
        expect(event.leavingplayersID).toEqual([]);
        expect((event.numberOfGemsInLeavingplayersBag)).toBe(0);
    })

})


function showTunnel(game:IncanGold){
    let output = "Tunnel's cards: ";
    let cards = game.tunnel.cards.map(card=>{
        if(card instanceof TreasureCard) return "[T: " + card.numOfGems + '/' +card.points + "]";
        if(card instanceof HazardCard) return "[H: " + card.name + "]";
        if(card instanceof ArtifactCard) return "[A: " + card.name + "]";
    }) + "\n";
    output = output.concat(cards);
    console.log(output); 
}