import Game from '../src/domain/entities/IncanGold';
import Card from '../src/domain/entities/Card/Card';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import GameService from '../src/app/useCase/use_case';
import HazardCard from '../src/domain/entities/Card/HazardCard';


describe("災難卡被放入通道",()=>{
    let gameService:GameService;

    beforeEach(()=>{
        gameService = new GameService();
    })

    it('回合第一張卡為災難卡，玩家只能繼續探險',()=>{
        // given 
        let game = gameService.game;
        HazardCard.initializeCounter();
        game.turn = 1;
        let Hfire:Card = new HazardCard('fire');
        game.tunnel.appendCard(Hfire);
        Hfire.tunnel = game.tunnel;
        Hfire.trigger();
        
        
        try{
            // when
            gameService.askPlayers();
        }catch(exp){
            // then
            expect(exp).toBe("沒得選，給我探險")
        }

    })

    it('災難卡種類尚未重複出現，繼續此turn',()=>{
        // given 
        let game = gameService.game;
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
        let Hfire:Card = new HazardCard('fire');
        game.tunnel.appendCard(Hfire);
        Hfire.tunnel = game.tunnel;
        Hfire.trigger();
        
        
        try{
            // when
            gameService.askPlayers();
        }catch(exp){
            // then
            expect(exp).toBe("請選擇離開通道或繼續探險")
        }

    })

    it('災難卡種類已重複出現，玩家們皆丟下背包、離開通道',()=>{
        // given 
        let game = gameService.game;
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
        game.tunnel.appendCard(Hpython_2);
        Hpython_2.tunnel = game.tunnel;
        
        try{
            // when
            Hpython_2.trigger();
        }catch(exp){
            // then
            expect(exp).toBe("通道沒人囉～該回合結束")
        }

    })

})