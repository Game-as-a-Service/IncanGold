import IncanGold from '../src/entities/IncanGold';
import Card from '../src/entities/Card/Card';
import TreasureCard from '../src/entities/Card/TreasureCard'
import HazardCard from '../src/entities/Card/HazardCard';
import { Choice } from '../src/constant/Choice';
import Player from '../src/entities/Player';
import ArtifactCard from '../src/entities/Card/ArtifactCard'
import GameoverEvent from '../src/events/GameOverEvent'

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe("當遊戲回合結束時,遊戲檢查回合數,並結算勝負or把通道中的卡洗回牌堆",()=>{

    it("遊戲回合數等於 5 , 結算勝負",()=>{
        // given
        const game = new IncanGold('1',['1','2']);
        game.round = 5;
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
        iterator.next(); // new Event('TurnEnd')
        iterator.next(); // RoundEndEvent

        // when 回合數超過5，遊戲結束 (詳見 IncanGold::*endRound)
        const event = <GameoverEvent>iterator.next().value; 

        // then 遊戲結束
        expect(event.name).toBe('GameOver')
    })

    it("遊戲回合數不等於 5 , 開始新回合新turn˙",()=>{
        const game = new IncanGold('1',['1','2']);
        game.round = 4;
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
        iterator.next(); // new Event('TurnEnd')
        iterator.next(); // RoundEndEvent

        // when 回合數未超過5，遊戲繼續 (詳見 IncanGold::*endRound)
        const event = <GameoverEvent>iterator.next().value; 

        // then 新Round，新Turn開始
        expect( (/^NewTurn.+/).test(event.name)).toBe(true);
        expect(game.round).toBe(5);
    })

})