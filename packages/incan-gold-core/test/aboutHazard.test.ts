import IncanGold from '../src/domain/entities/IncanGold';
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
        game.round = 1;
        game.turn = 0;
        game.deck.appendCard(new HazardCard('fire'));
        game.onTurnStart();

        // when 遊戲寄出『選擇』給玩家們
        let event:Event = game.askPlayers();

        // then 3位玩家們將收到『沒得選』
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
        

        let it = game.makeChoice(game.players[0],Choice.KeepGoing);
        it.next(); // 1號玩家已選擇
        it.next(); // 1號玩家選擇繼續探險
        it.next(); // IncanGold.getAndGo()

        // when
        let event:Event|void = it.next().value; // IncanGold.onTurnStart()

        // then
        expect((<NewTurnHazardCardTriggeredEvent>event).data.forcePlayersToLeave).toBe(false)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.currentTurn).toBe(3)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.cardName).toBe("fire")
        expect(game.round).toBe(3);

    })

    it('災難卡種類已重複出現，玩家們皆丟下背包、離開通道',()=>{
        // given 
        game.setPlayerCount(2);
        game.players.forEach(player=>player.enterTunnel());
        HazardCard.initializeCounter();
        game.round = 1;
        game.turn = 2;
        game.tunnel.appendCard(new HazardCard('spider'));
        game.tunnel.getLastCard().trigger();
        game.tunnel.appendCard(new HazardCard('python'));
        game.tunnel.getLastCard().trigger();

        game.deck.appendCard(new HazardCard('python'));

        game.players[0].choice = Choice.KeepGoing;
        game.players[1].choice = Choice.NotSelected;

        let it = game.makeChoice(game.players[1],Choice.KeepGoing);
        it.next(); // 2號玩家已選擇
        it.next(); // 1、2號玩家皆選擇繼續探險
        it.next(); // IncanGold.getAndGo()

        // when 災難卡片觸發了效果
        let event:Event|void = it.next().value; // IncanGold.onTurnStart()
        
        // then 第3Turn出現了重複的蟒蛇，強迫玩家們離開
        expect((<NewTurnHazardCardTriggeredEvent>event).data.currentTurn).toBe(3)
        expect((<NewTurnHazardCardTriggeredEvent>event).data.cardName).toBe("python")
        expect((<NewTurnHazardCardTriggeredEvent>event).data.forcePlayersToLeave).toBe(true)
        // 通道中有2個背包，0位玩家
        expect(game.tunnel.bags.length).toBe(2); // 留下2個背包
        expect(game.getPlayersInTunnel().length).toBe(0);

        it.next(); // IncanGold.onRoundEnd()
        it.next(); // IncanGold.onRoundStart()
        console.log(it.next().value); // IncanGold.onTurnStart()
        console.log(it.next().value); // IncanGold.askplayer()
    })

})