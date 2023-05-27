import IncanGold from '../src/domain/entities/IncanGold';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import { Choice } from '../src/domain/entities/Player';

describe('',()=>{
    let game:IncanGold;

    beforeEach(()=>{
        game = new IncanGold();
    })

    it("通道中沒有玩家，回合結束",()=>{
        // given
        game.round = 3;
        game.turn = 3;
        HazardCard.initializeCounter();
        game.setPlayerCount(2);
        game.players.forEach(player=>player.enterTunnel());
        // 通道中有1張寶物卡(7)
        game.tunnel.appendCard(new TreasureCard(7));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張神器(5)
        game.tunnel.appendCard(new ArtifactCard("artifact",5));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張災難卡(火焰)
        game.tunnel.appendCard(new HazardCard("fire"));
        game.tunnel.getLastCard().trigger();
        game.players[0].choice = Choice.Quit;

        // when
        const events = Array.from(game.makeChoice(game.players[1],Choice.Quit));
        console.log(events[events.length-2]);

        // then 新Round，第1Turn
        expect(game.round).toBe(4);
        game.players.forEach(player=>{ expect(player.inTent).toBe(false) });
        expect(game.tunnel.cards.length).toBe(1);

    })

    it("通道中有玩家，回合繼續",()=>{
        // given
        game.round = 3;
        game.turn = 3;
        HazardCard.initializeCounter();
        game.setPlayerCount(2);
        game.players.forEach(player=>player.enterTunnel());
        // 通道中有1張寶物卡(7)
        game.tunnel.appendCard(new TreasureCard(7));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張神器(5)
        game.tunnel.appendCard(new ArtifactCard("artifact",5));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張災難卡(火焰)
        game.tunnel.appendCard(new HazardCard("fire"));
        game.tunnel.getLastCard().trigger();
        game.players[0].choice = Choice.Quit;
        game.deck.appendCard(new HazardCard("mummy"));

        // when
        const events = Array.from(game.makeChoice(game.players[1],Choice.KeepGoing));
        console.log(events[events.length-2]);

        // then 同Round，下1Turn
        expect(game.round).toBe(3);
        expect(game.turn).toBe(4);
        expect(game.players[0].inTent).toBe(true);
        expect(game.players[1].inTent).toBe(false);
        expect(game.tunnel.cards.length).toBe(4);
    })
})

