import Game from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard';


describe('寶物卡將寶石平分給通道中的玩家', ()=>{
    let game : Game;

    beforeEach(()=>{
        game = new Game();
    })

    it(`寶石數對人數除的盡`,()=>{
        // given 
        // 通道中有3位玩家，背包皆為空
        game.setPlayerCount(3);
        game.players.forEach((player)=>{player.enterTunnel()});
        // 寶物卡(9)被放入通道
        game.tunnel.appendCard(new TreasureCard(9));

        // when 寶物卡(9)平分寶石
        game.tunnel.getLastCard().trigger();

        // then 3位玩家的背包裡都會裝3顆寶石
        for(let player of game.players)
            expect(player.bag?.gems.length).toBe(3);
    })

    it(`寶石數對人數除不盡`,()=>{
        // given 
        // 通道中有3位玩家，背包皆為空
        game.setPlayerCount(3);
        game.players.forEach((player)=>{player.enterTunnel()});
        // 寶物卡(10)被放入通道
        game.tunnel.appendCard(new TreasureCard(10));

        // when 寶物卡(10)平分寶石
        game.tunnel.getLastCard().trigger();

        // then 3位玩家的背包裡都會裝3顆寶石
        for(let player of game.players)
            expect(player.bag?.gems.length).toBe(3);
        expect((<TreasureCard>game.tunnel.getLastCard()).gems.length).toBe(1);
    })

    it(`放置寶物卡時，只平分這張卡上的寶石：`,()=>{
        // given 
        // 通道中有2位玩家，背包皆為空
        game.setPlayerCount(2);
        game.players.forEach((player)=>{player.enterTunnel()});
        // 通道中有一張寶物卡(1)
        game.tunnel.appendCard(new TreasureCard(1));
        game.tunnel.getLastCard().trigger();
        // 寶物卡(4)被放入通道
        game.tunnel.appendCard(new TreasureCard(4));

        // when 寶物卡(4)平分寶石
        game.tunnel.getLastCard().trigger();


        // then 2位玩家的背包裡都會裝2顆寶石
        for(let player of game.players)
            expect(player.bag?.gems.length).toBe(2);
        expect((<TreasureCard>game.tunnel.cards[0]).gems.length).toBe(1);
        expect((<TreasureCard>game.tunnel.cards[1]).gems.length).toBe(0);
    })
})
