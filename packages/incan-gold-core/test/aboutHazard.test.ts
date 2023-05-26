import IncanGold from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import Player,{Choice} from '../src/domain/entities/Player';
import { Event,NewTurnHazardCardTriggeredEvent } from '../src/domain/events/Event';


describe("災難卡被放入通道",()=>{
    let game:IncanGold;

    beforeEach(()=>{
        game = new IncanGold();
    })

    it('回合第一張卡為災難卡，玩家只能繼續探險',()=>{
        // given 
        game.setPlayerCount(3);
        game.players.forEach(p=>p.enterTunnel());

        HazardCard.initializeCounter();
        game.turn = 0;
        game.deck.appendCard(new HazardCard('fire'));
        game.onTurnStart();

        // when
        let event:Event = game.askPlayers();

        // then
        expect(event.name).toBe("NoChoice");
        expect(event.data.allPlayersInTunnel).toEqual([1,2,3]);

    })

    it('災難卡種類尚未重複出現,繼續此round',()=>{
        // given 
        game.setPlayerCount(1);
        game.players[0].enterTunnel();

        HazardCard.initializeCounter();
        game.round = 3;
        game.turn = 2;
        game.deck.appendCard(new HazardCard('spider'));
        game.putCardInTunnel();
        game.tunnel.getLastCard().trigger();
        game.deck.appendCard(new HazardCard('python'));
        game.putCardInTunnel();
        game.tunnel.getLastCard().trigger();

        game.deck.appendCard(new HazardCard('fire'));
        

        // when
        let it = game.makeChoice(game.players[0],Choice.KeepGoing);
        // it.next();
        console.log(it.next().value);
        console.log(it.next().value);
        console.log(it.next().value);
        let event:Event|null = it.next().value || null;

        // then
        expect((<NewTurnHazardCardTriggeredEvent>event).data.forcePlayersToLeave).toBe(false)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.currentTurn).toBe(3)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.cardName).toBe("fire")
        

    })

    it('災難卡種類已重複出現，玩家們皆丟下背包、離開通道',()=>{
        // given 
        game.setPlayerCount(2);
        game.players.forEach(player=>player.enterTunnel());
        HazardCard.initializeCounter();
        game.turn = 3;
        let Hspider:Card = new HazardCard('spider');
        game.tunnel.appendCard(Hspider);
        Hspider.tunnel = game.tunnel;
        Hspider.trigger();
        let Hpython:Card = new HazardCard('python');
        game.tunnel.appendCard(Hpython);
        Hpython.tunnel = game.tunnel;
        Hpython.trigger();

        let Hpython_2:Card = new HazardCard('python');
        game.deck.appendCard(Hpython_2);

        game.players[0].choice = Choice.KeepGoing;
        
        // when
        let it = game.makeChoice(game.players[1],Choice.KeepGoing);
        it.next(); // 2號玩家已選擇
        it.next(); // 1、2號玩家皆選擇繼續探險
        it.next(); // 分配寶石給要離開的玩家
        let event:Event|null = it.next().value || null; // 回合開始，災難卡被放置於通道中並觸發效果
        // let event2:Event|null = it.next().value || null; // 
        expect((<NewTurnHazardCardTriggeredEvent>event).data.forcePlayersToLeave).toBe(true)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.currentTurn).toBe(4)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.cardName).toBe("python")

    })

})