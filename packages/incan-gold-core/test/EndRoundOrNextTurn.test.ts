import IncanGold from '../src/domain/entities/IncanGold';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import { Choice } from '../src/domain/constant/Choice';
import RoundEndEvent from '../src/domain/events/RoundEndEvent';

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('',()=>{

    it("通道中沒有玩家，回合結束",()=>{
        // given
        const game = new IncanGold('1',['1','2']);
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
        const game = new IncanGold('1',['1','2']);
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
})

