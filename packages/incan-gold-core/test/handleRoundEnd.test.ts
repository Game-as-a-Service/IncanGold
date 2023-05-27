import IncanGold from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import Player,{Choice} from '../src/domain/entities/Player';
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'

describe("當遊戲回合結束時,遊戲檢查回合數,並結算勝負or把通道中的卡洗回牌堆",()=>{
    let game:IncanGold;

    beforeEach(()=>{
        game = new IncanGold();
    })

    it("遊戲回合數等於 5 , 結算勝負",()=>{
        // given
        HazardCard.initializeCounter();
        game.round = 5;
        game.turn = 3;
        game.setPlayerCount(2);
        game.players.forEach(player=>player.enterTunnel());

        // 通道中有1張寶物卡(7)
        game.tunnel.appendCard(new TreasureCard(7));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張災難卡(火焰)
        game.tunnel.appendCard(new HazardCard("fire"));
        game.tunnel.getLastCard().trigger();
        // 1號玩家離開通道
        game.players[0].leaveTunnel();
        // 通道中有1張寶物卡(1)
        game.tunnel.appendCard(new TreasureCard(1));
        game.tunnel.getLastCard().trigger();

        // when
        const events = Array.from(game.makeChoice(game.players[1],Choice.Quit));
        console.log(events[events.length-1]);

        // then 游細結束，2號玩家為贏家
        expect(game.winnerID).toBe(2)
    })

    it("遊戲回合數不等於 5 , 開始新回合新turn˙",()=>{
        // given
        HazardCard.initializeCounter();
        game.round = 4;
        game.turn = 3;
        game.setPlayerCount(2);
        game.players.forEach(player=>player.enterTunnel());

        // 通道中有1張寶物卡(7)
        game.tunnel.appendCard(new TreasureCard(7));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張災難卡(火焰)
        game.tunnel.appendCard(new HazardCard("fire"));
        game.tunnel.getLastCard().trigger();
        // 1號玩家離開通道
        game.players[0].leaveTunnel();
        // 通道中有1張寶物卡(1)
        game.tunnel.appendCard(new TreasureCard(1));
        game.tunnel.getLastCard().trigger();

        // when
        const events = Array.from(game.makeChoice(game.players[1],Choice.Quit));
        console.log(events[events.length-1]);

        // then 新round，第1Turn，遊戲繼續
        expect(game.round).toBe(5);
        expect(game.turn).toBe(1);
        expect(game.getPlayersInTunnel().length).toBe(2);
    })

})