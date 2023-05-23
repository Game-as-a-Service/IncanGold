import Game from '../src/entities/Game';
import Card from '../src/entities/Card/Card';
import TreasureCard from '../src/entities/Card/TreasureCard'
import GameService from '../src/useCase/use_case';

describe("當遊戲回合結束時，遊戲檢查回合數，並結算勝負or把通道中的卡洗回牌堆",()=>{
    let gameService:GameService;

    beforeEach(()=>{
        gameService = new GameService();
    })

    it("遊戲回合數等於 5 , 結算勝負",()=>{
        // given
        let game = gameService.game;
        game.setPlayerCount(2);
        game.round = 5;
        game.tents[0].points = 5;
        game.tents[1].points = 10;
        // when
        gameService.afterRoundEnd();
        // then
        expect(game.winnerID).toBe(2)
    })

    it("遊戲回合數不等於 5 , 開始新回合新turn˙",()=>{
        // given
        let game = gameService.game;
        game.setPlayerCount(2);
        game.round = 4;
        game.deck.cards.splice(20);
        let T4:Card = new TreasureCard(4);
        game.tunnel.cards.push(T4);
        T4.tunnel = game.tunnel;
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;

        // when
        gameService.afterRoundEnd();

        // then
        expect(game.deck.cards.length).toBe(22);
        expect(game.tunnel.cards.length).toBe(1);
    })

})