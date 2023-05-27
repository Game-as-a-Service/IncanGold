import IncanGold from '../src/domain/entities/IncanGold';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard,{artifactList} from '../src/domain/entities/Card/ArtifactCard'
import Player,{Choice} from '../src/domain/entities/Player';

describe('玩家選擇結束後，分配寶石&神器', ()=>{
    let game : IncanGold;

    beforeEach(()=>{
        game = new IncanGold();
    })

    it(`僅1名玩家選擇回家,寶石、神器全拿`,()=>{
        // given 
        game.setPlayerCount(2);
        game.players.forEach(player => player.enterTunnel());
        // 通道中有寶物卡(3、5)
        game.tunnel.appendCard(new TreasureCard(3));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new TreasureCard(5));
        game.tunnel.getLastCard().trigger();
        // 通道中有1張神器
        game.tunnel.appendCard(new ArtifactCard("artifact",5));
        game.tunnel.getLastCard().trigger();
        // 通道中有2位玩家，1個繼續探險；1個回到營地
        game.players[0].choice = Choice.KeepGoing;
        game.players[1].choice = Choice.Quit;


        // when 系統平分通道中所有的寶石&神器
        let it = game.getAndGo();

        // then 
        expect(game.tents[1].points).toBe(10); 
        expect(game.tents[1].artifacts.length).toBe(1);
        expect((<TreasureCard>game.tunnel.cards[0]).gems.length).toBe(0);
        expect((<TreasureCard>game.tunnel.cards[1]).gems.length).toBe(0);
        expect(game.players[0].inTent).toBe(false);
        expect(game.players[1].inTent).toBe(true);
    })
    

    it(`多名玩家選擇回家，寶石平分，神器留在通道中`,()=>{
        // given 
        // 通道中有3位玩家，全都選擇回到營地
        game.setPlayerCount(3);
        game.players.forEach(player => {
            player.enterTunnel();
            player.choice = Choice.Quit;
        });
        // 通道中有寶物卡(4、5)，1張神器
        game.tunnel.appendCard(new TreasureCard(4));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new TreasureCard(5));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new ArtifactCard("artifact",5));
        game.tunnel.getLastCard().trigger();

        
        // when 系統平分通道中所有的寶石&神器
        game.getAndGo();


        // then 
        game.tents.forEach(tent=>{
            expect(tent.points).toBe(3); 
            expect(tent.artifacts.length).toBe(0);
            expect(tent.player?.inTent).toBe(true);
        });
        expect((<TreasureCard>game.tunnel.cards[0]).gems.length).toBe(0);
        expect((<TreasureCard>game.tunnel.cards[1]).gems.length).toBe(0);
        expect((<ArtifactCard>game.tunnel.getLastCard()).name).toBe('artifact');

    })

    it(`多名玩家選擇回家，寶石數對人數除不盡會留在寶物卡上`,()=>{
        // given 
        // 通道中有3位玩家，全都選擇回到營地
        game.setPlayerCount(3);
        game.players.forEach(player => {
            player.enterTunnel();
            player.choice = Choice.Quit;
        });
        // 通道中有寶物卡(4、7)，1張神器
        game.tunnel.appendCard(new TreasureCard(4));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new TreasureCard(7));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new ArtifactCard("artifact",5));
        game.tunnel.getLastCard().trigger();

        
        // when 系統平分通道中所有的寶石&神器
        const event = game.getAndGo();
        console.log(event);

        // then 
        game.tents.forEach(tent=>{
            expect(tent.points).toBe(3);            // 營地總分累積3分
            expect(tent.artifacts.length).toBe(0);  // 營地沒神器
            expect(tent.player?.inTent).toBe(true); // 玩家在營地內
        });
        expect((<TreasureCard>game.tunnel.cards[0]).gems.length).toBe(1); // 通道內寶物卡的寶石還在
        expect((<TreasureCard>game.tunnel.cards[1]).gems.length).toBe(1); // 通道內寶物卡的寶石還在
        expect((<ArtifactCard>game.tunnel.getLastCard()).name).toBe('artifact'); // 神器卡還在通道內

    })

    it(`所有玩家選擇繼續探險，寶石、神器皆留在通道中`,()=>{
        // given 
        // 通道中有2位玩家，全都選擇繼續探險
        game.setPlayerCount(2);
        game.players.forEach(player => {
            player.enterTunnel();
            player.choice = Choice.KeepGoing;
        });
        // 通道中有寶物卡(4、7)，1張神器
        game.tunnel.appendCard(new TreasureCard(4));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new TreasureCard(7));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new ArtifactCard("artifact",5));
        game.tunnel.getLastCard().trigger();

        
        // when 系統平分通道中所有的寶石&神器
        const event = game.getAndGo();
        console.log(event);

        // then 
        game.tents.forEach(tent=>{
            expect(tent.points).toBe(0);              // 營地沒分數
            expect(tent.artifacts.length).toBe(0);    // 營地沒神器
            expect(tent.player?.inTent).toBe(false);  // 在通道中
            expect(tent.player?.bag?.points).toBe(5); // 背包有5顆寶石
        });
        // 卡片留在通道中
        expect((<TreasureCard>game.tunnel.cards[0]).gems.length).toBe(0);
        expect((<TreasureCard>game.tunnel.cards[1]).gems.length).toBe(1);
        expect((<ArtifactCard>game.tunnel.getLastCard()).name).toBe('artifact');
    })
})