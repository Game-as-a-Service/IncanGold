import Game from '../src/entities/Game';
import Card from '../src/entities/Card/Card';
import TreasureCard from '../src/entities/Card/TreasureCard'
import ArtifactCard from '../src/entities/Card/ArtifactCard'
import HazardCard, { hazardNames } from '../src/entities/Card/HazardCard';
import GameService from '../src/useCase/use_case';
import Gem from '../src/entities/Gem';

describe('',()=>{
    let gameService:GameService;

    beforeEach(()=>{
        gameService = new GameService();
    })

    it("通道中沒有玩家，回合結束",()=>{
        // given
        HazardCard.initializeCounter();
        let game = gameService.game;
        game.setPlayerCount(2);
        game.round = 3;
        // 通道中有寶物卡(7)，2寶石
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;
        (<TreasureCard>T7).gems.push(new Gem());
        (<TreasureCard>T7).gems.push(new Gem());
        // 通道中有一張神器(5)
        let A5:Card = new ArtifactCard("artifact",5);
        game.tunnel.cards.push(A5);
        A5.tunnel = game.tunnel;
        // 通道中有一張災難卡(火焰)
        let Hfire:Card = new HazardCard("fire");
        game.tunnel.cards.push(Hfire);
        Hfire.tunnel = game.tunnel;

        // when
        gameService.afterPlayersChoice(['quit','quit']);

        // then
        expect((<ArtifactCard>game.trashDeck.cards[0]).points).toBe(5);
        expect((<TreasureCard>T7).gems.length).toBe(0);
        expect(game.tunnel.bags.length).toBe(0);
        // 新一回合，新turn
        expect(game.round).toBe(4);
        expect(game.players[0].inTent).toBe(false);
        expect(game.players[1].inTent).toBe(false);

    })

    it("通道中沒有玩家，回合結束",()=>{
        // given
        HazardCard.initializeCounter();
        let game = gameService.game;
        game.setPlayerCount(2);
        game.round = 3;
        // 通道中有寶物卡(7)，2寶石
        let T7:Card = new TreasureCard(7);
        game.tunnel.cards.push(T7);
        T7.tunnel = game.tunnel;

        // when
        gameService.afterPlayersChoice(['quit','keepGoing']);

        // then
        expect(game.tunnel.cards.length).toBe(2);
        // 維持在第3回合，新turn
        expect(game.round).toBe(3);
        expect(game.players[0].inTent).toBe(true);
        expect(game.players[1].inTent).toBe(false);

    })

})

