import Game from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import Gem from '../src/domain/entities/Gem';

describe('玩家選擇結束後，分配寶石&神器', ()=>{
    let game : Game;

    beforeEach(()=>{
        game = new Game();
    })

    it(`僅1名玩家選擇回家，寶石、神器全拿`,()=>{
        // given 
        // 通道中有2位玩家，一個繼續探險；一個回到營地
        game.setPlayerCount(2);
        game.players[0].enterTunnel();
        game.players[1].enterTunnel();
        game.players[0].choice = "keepGoing";
        game.players[1].choice = "quit";
        // 通道中有寶物卡(3、5)，上面都有一顆寶石
        let T3:Card = new TreasureCard(3);
        game.tunnel.cards.push(T3);
        T3.tunnel = game.tunnel;
        (<TreasureCard>T3).gems.push(new Gem());
        let T5:Card = new TreasureCard(5);
        game.tunnel.cards.push(T5);
        T5.tunnel = game.tunnel;
        (<TreasureCard>T5).gems.push(new Gem());
        // 通道中有一張神器
        let A5:Card = new ArtifactCard("artifact",5);
        game.tunnel.cards.push(A5);
        A5.tunnel = game.tunnel;


        // when 系統平分通道中所有的寶石&神器
        game.getAndGo();

        // then 
        expect(game.tents[1].bags[0].gems.length).toBe(2); 
        expect(game.tents[1].bags[0].artifactCards[0].points).toBe(5);
        expect((<TreasureCard>T3).gems.length).toBe(0);
        expect((<TreasureCard>T5).gems.length).toBe(0);
        expect(A5.tunnel).toBeNull();
        expect(game.players[0].inTent).toBe(false);
        expect(game.players[1].inTent).toBe(true);
    })
    

    it(`多名玩家選擇回家，寶石平分，神器留在通道中`,()=>{
        // given 
        // 通道中有3位玩家，全都選擇回到營地
        game.setPlayerCount(3);
        for(let player of game.players){
            player.enterTunnel();
            player.choice = "quit";
        }
        // 通道中有寶物卡(4、5)，
        let T4:Card = new TreasureCard(4);
        game.tunnel.cards.push(T4);
        T4.tunnel = game.tunnel;
        (<TreasureCard>T4).gems.push(new Gem());
        let T5:Card = new TreasureCard(5);
        game.tunnel.cards.push(T5);
        T5.tunnel = game.tunnel;
        (<TreasureCard>T5).gems.push(new Gem());
        (<TreasureCard>T5).gems.push(new Gem());
        // 通道中有一張神器
        let A5:Card = new ArtifactCard("artifact",5);
        game.tunnel.cards.push(A5);
        A5.tunnel = game.tunnel;


        // when 系統平分通道中所有的寶石&神器
        try { game.getAndGo(); }
        catch{ }

        // then 
        for(let tent of game.tents){
            expect(tent.bags[0].gems.length).toBe(1); 
            expect(tent.bags[0].artifactCards.length).toBe(0); 
            if(tent.player) expect(tent.player.inTent).toBe(true);
        }
        expect((<TreasureCard>T4).gems.length).toBe(0);
        expect((<TreasureCard>T5).gems.length).toBe(0);
        expect(A5.tunnel).toEqual(game.tunnel);
    })

    it(`多名玩家選擇回家，寶石數對人數除不盡會留在寶物卡上`,()=>{
        // given 
        // 通道中有3位玩家，全都選擇回到營地
        game.setPlayerCount(3);
        for(let player of game.players){
            player.enterTunnel();
            player.choice = "quit";
        }
        // 通道中有寶物卡(4、7)，
        let T4:Card = new TreasureCard(4);
        game.tunnel.cards.push(T4);
        T4.tunnel = game.tunnel;
        (<TreasureCard>T4).gems.push(new Gem());
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;
        (<TreasureCard>T7).gems.push(new Gem());

        // when 系統平分通道中所有的寶石&神器
        try { game.getAndGo(); }
        catch{ }

        // then 
        for(let tent of game.tents){
            expect(tent.bags[0].gems.length).toBe(0); 
            if(tent.player) expect(tent.player.inTent).toBe(true);
        }
        expect((<TreasureCard>T4).gems.length).toBe(1);
        expect((<TreasureCard>T7).gems.length).toBe(1);
    })

    it(`所有玩家選擇繼續探險，寶石、神器皆留在通道中`,()=>{
        // given 
        // 通道中有3位玩家，全都選擇回到營地
        game.setPlayerCount(3);
        for(let player of game.players){
            player.enterTunnel();
            player.choice = "keepGoing";
        }
        // 通道中有寶物卡(4、7)
        let T4:Card = new TreasureCard(4);
        game.tunnel.cards.push(T4);
        T4.tunnel = game.tunnel;
        (<TreasureCard>T4).gems.push(new Gem());
        expect((<TreasureCard>T4).gems.length).toBe(1);
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;
        (<TreasureCard>T7).gems.push(new Gem());

        // 通道中有一張神器
        let A5:Card = new ArtifactCard("artifact",5);
        game.tunnel.cards.push(A5);
        A5.tunnel = game.tunnel;

        // when 系統平分通道中所有的寶石&神器
        try { game.getAndGo(); }
        catch{ }

        // then 
        for(let player of game.players){
            expect(player.bag?.gems.length).toBe(0); 
            expect(player.inTent).toBe(false);
        }
        expect((<TreasureCard>T4).gems.length).toBe(1);
        expect((<TreasureCard>T7).gems.length).toBe(1);
    })
})