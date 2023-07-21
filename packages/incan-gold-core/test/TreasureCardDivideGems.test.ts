import IncanGold from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard';
import { NewTurnTreasureCardTriggeredEvent } from "../src/domain/events/NewTurnCardTriggeredEvent";

// 以下都是在 this.addArtifactCardAndShuffleDeck(); 被註解掉的情況下進行的測試
describe('寶物卡將寶石平分給通道中的玩家', ()=>{

    it(`寶石數對人數除的盡`,()=>{
        // given 
        const game = new IncanGold('1',['1','2','3']);
        game.makePlayersEnterTunnel();
        game.tunnel.appendCard(new TreasureCard("T9",9));

        // when 寶物卡(9)平分寶石
        const event =  <NewTurnTreasureCardTriggeredEvent>(game.tunnel.lastCard.trigger(game));

        // then 
        expect(event.numberOfGemsInBag).toBe(3);
        expect(event.numberOfGemsOnCard).toBe(0);
    })

    it(`寶石數對人數除不盡`,()=>{
        // given 
        const game = new IncanGold('1',['1','2','3']);
        game.makePlayersEnterTunnel();
        game.tunnel.appendCard(new TreasureCard("T10",10));

        // when 寶物卡(10)平分寶石
        const event =  <NewTurnTreasureCardTriggeredEvent>(game.tunnel.lastCard.trigger(game));

        // then 
        expect(event.numberOfGemsInBag).toBe(3);
        expect(event.numberOfGemsOnCard).toBe(1);
    })

    it(`放置寶物卡時，只平分這張卡上的寶石：`,()=>{
        // given 
        const game = new IncanGold('1',['1','2']);
        game.makePlayersEnterTunnel();
        game.tunnel.appendCard(new TreasureCard("T1",1));
        game.tunnel.lastCard.trigger(game);
        game.tunnel.appendCard(new TreasureCard("T4",4));

        // when 寶物卡(4)平分寶石
        const event =  <NewTurnTreasureCardTriggeredEvent>(game.tunnel.lastCard.trigger(game));

        // then 
        expect(event.numberOfGemsInBag).toBe(2);
        expect(event.numberOfGemsOnCard).toBe(0);
        expect((<TreasureCard>game.tunnel.cards[0]).numOfGems).toBe(1);
    })
})
