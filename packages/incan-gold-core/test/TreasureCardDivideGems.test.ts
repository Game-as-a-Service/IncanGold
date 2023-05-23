import Game from '../src/entities/Game';
import Card from '../src/entities/Card/Card';
import TreasureCard from '../src/entities/Card/TreasureCard'


describe('寶物卡將寶石平分給通道中的玩家', ()=>{
    let game : Game;

    beforeEach(()=>{
        game = new Game();
    })

    it(`寶石數對人數除的盡`,()=>{
        // given 
        // 通道中有3位玩家，背包皆為空
        game.setPlayerCount(3);
        game.players.forEach((player)=>{
            player.enterTunnel();
        })
        // 寶物卡(9)被放入通道
        let T9:Card = new TreasureCard(9);
        game.tunnel.cards.push(T9);
        T9.tunnel = game.tunnel;

        // when 寶物卡(9)平分寶石
        T9.trigger();

        // then 3位玩家的背包裡都會裝3顆寶石
        for(let player of game.players)
            expect(player.bag?.gems.length).toBe(3);
    })

    it(`寶石數對人數除不盡`,()=>{
        // given 
        // 通道中有3位玩家，背包皆為空
        game.setPlayerCount(3);
        game.players.forEach((player)=>{
            player.enterTunnel();
        })
        // 寶物卡(10)被放入通道
        let T10:Card = new TreasureCard(10);
        game.tunnel.cards.push(T10);
        T10.tunnel = game.tunnel;

        // when 寶物卡(10)平分寶石
        T10.trigger();

        // then 
        // 3位玩家的背包裡都會裝3顆寶石
        for(let player of game.players)
            expect(player.bag?.gems.length).toBe(3);
        // 通道中的此張寶物卡上要留有1顆寶石
        expect((<TreasureCard>T10).gems.length).toBe(1);
    })

    it(`放置寶物卡時，只平分這張卡上的寶石：`,()=>{
        // given 
        // 通道中有2位玩家，背包皆為空
        game.setPlayerCount(2);
        game.players.forEach((player)=>{
            player.enterTunnel();
        })
        // 通道中有1張寶物卡(1)，其上留有1顆寶石
        let T1:Card = new TreasureCard(1);
        (<TreasureCard>T1).generateGems();
        game.tunnel.cards.push(T1);

        // 寶物卡(4)被放入通道
        let T4:Card = new TreasureCard(4);
        game.tunnel.cards.push(T4);
        T4.tunnel = game.tunnel;

        // when 寶物卡(4)平分寶石
        T4.trigger();

        // then 
        // 2位玩家的背包裡都會裝2顆寶石
        for(let player of game.players)
            expect(player.bag?.gems.length).toBe(2);
        // 寶物卡(1)上有1顆寶石
        expect((<TreasureCard>T1).gems.length).toBe(1);
        // 寶物卡(4)上有0顆寶石
        expect((<TreasureCard>T4).gems.length).toBe(0);
    })

})
