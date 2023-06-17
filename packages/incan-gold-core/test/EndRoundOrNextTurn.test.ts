<<<<<<< HEAD
import IncanGold from '../src/domain/entities/IncanGold';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import { Choice } from '../src/domain/entities/Player';
import RoundEndEvent from '../src/domain/events/RoundEndEvent';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('',()=>{
    let game:IncanGold;

    beforeEach(()=>{
        game = new IncanGold();
=======
import Game from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import HazardCard, { hazardNames } from '../src/domain/entities/Card/HazardCard';
import GameService from '../src/app/useCase/use_case';
import Gem from '../src/domain/entities/Gem';

describe('',()=>{
    let gameService:GameService;

    beforeEach(()=>{
        gameService = new GameService();
>>>>>>> main
    })

    it("通道中沒有玩家，回合結束",()=>{
        // given
<<<<<<< HEAD
        game.setPlayerCount(2);
        game.round = 3;
        game.turn = 3;
        game.resetHazardCardCounter();
        game.makePlayersEnterTunnel();
        game.players.forEach(player=>player.enterTunnel());
        game.tunnel.appendCard(new TreasureCard("T7(1)",7));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new ArtifactCard("A1","artifact",5));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new HazardCard("HF1","fire"));
        game.tunnel.lastCard.trigger(game);
        game.makeChoice(game.playersInTunnel[0], Choice.Quit).next();
        const iterator = game.makeChoice(game.playersInTunnel[1], Choice.Quit);
        iterator.next(); // PlayerMadeChoiceEvent
        iterator.next(); // AllPlayersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToPlayersEvent
        iterator.next(); // new Event('TurnEnd');
        
        // when 通道中沒有玩家就結束回合 (詳見 IncanGold::*endTurn)
        const event = <RoundEndEvent>iterator.next().value; 

        // then 新Round，第1Turn
        expect(event.name).toBe('RoundEnd');
    })

    it("通道中有玩家，回合繼續",()=>{
        // given
        game.setPlayerCount(2);
        game.round = 3;
        game.turn = 3;
        game.resetHazardCardCounter();
        game.makePlayersEnterTunnel();
        game.players.forEach(player=>player.enterTunnel());
        game.tunnel.appendCard(new TreasureCard("T7(1)",7));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new ArtifactCard("A1","artifact",5));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new HazardCard("HF1","fire"));
        game.tunnel.lastCard.trigger(game);
        game.makeChoice(game.playersInTunnel[0], Choice.Quit).next();
        const iterator = game.makeChoice(game.playersInTunnel[1], Choice.KeepGoing);
        iterator.next(); // PlayerMadeChoiceEvent
        iterator.next(); // AllPlayersMadeChoiceEvent
        iterator.next(); // DistributeGemsAndArtifactsToPlayersEvent
        iterator.next(); // new Event('TurnEnd');
        
        // when 通道中有玩家就開始新一Turn (詳見 IncanGold::*endTurn)
        const event = <RoundEndEvent>iterator.next().value; 
        console.log(event);

        // then 同Round，新Turn開始
        expect( (/^NewTurn.+/).test(event.name)).toBe(true);
    })
=======
        HazardCard.initializeCounter();
        let game = gameService.game;
        game.setPlayerCount(2);
        game.round = 3;
        // 通道中有寶物卡(7)，2寶石
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;
        (<TreasureCard>T7).gems.push(new Gem());
        (<TreasureCard>T7).gems.push(new Gem());
        // 通道中有一張神器(5)
        let A5:Card = new ArtifactCard("artifact",5);
        game.tunnel.cards.push(A5);
        A5.tunnel = game.tunnel;
        // 通道中有一張災難卡(火焰)
        let Hfire:Card = new HazardCard("fire");
        game.tunnel.cards.push(Hfire);
        Hfire.tunnel = game.tunnel;

        // when
        gameService.afterPlayersChoice(['quit','quit']);

        // then
        expect((<ArtifactCard>game.trashDeck.cards[0]).points).toBe(5);
        expect((<TreasureCard>T7).gems.length).toBe(0);
        expect(game.tunnel.bags.length).toBe(0);
        // 新一回合，新turn
        expect(game.round).toBe(4);
        expect(game.players[0].inTent).toBe(false);
        expect(game.players[1].inTent).toBe(false);

    })

    it("通道中沒有玩家，回合結束",()=>{
        // given
        HazardCard.initializeCounter();
        let game = gameService.game;
        game.setPlayerCount(2);
        game.round = 3;
        // 通道中有寶物卡(7)，2寶石
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;

        // when
        gameService.afterPlayersChoice(['quit','keepGoing']);

        // then
        expect(game.tunnel.cards.length).toBe(2);
        // 維持在第3回合，新turn
        expect(game.round).toBe(3);
        expect(game.players[0].inTent).toBe(true);
        expect(game.players[1].inTent).toBe(false);

    })

>>>>>>> main
})

