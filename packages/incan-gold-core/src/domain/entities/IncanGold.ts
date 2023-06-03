import Card from "./Card/Card"
import ArtifactCard, { artifactName, artifactPoints } from "./Card/ArtifactCard"
import HazardCard,{hazardNames} from "./Card/HazardCard"
import {TrashDeck, Deck} from "./Deck"
import Tunnel from "./Tunnel"
import Player, {Choice} from "./Player"
import Event, { EventName } from "../events/Event"
import RoundEndEvent from "../events/RoundEndEvent"
import {PlayerMadeChoiceEvent,AllPlayersMadeChoiceEvent} from "../events/MadeChoiceEvent"
import DistributeGemsAndArtifactsToPlayersEvent from "../events/DistributeGemsAndArtifactsToPlayersEvent";
import GameoverEvent from "../events/GameoverEvent";
import TresasureCard from "./Card/TreasureCard"

export default class IncanGold {
    public tunnel:Tunnel = new Tunnel();
    public deck:Deck = new Deck();
    public trashDeck:TrashDeck = new TrashDeck();
    public players:Player[] = [];

    public hazardCardCounter: Record<string, number> = {};
    public forceExplore:boolean = false;
    public round:number = 0;
    public turn:number = 0;
    public winnerID:number = 0;
    public gameover:boolean = false;

    public setPlayerCount(num:number) {
        for(let i=1;i<=num;i++)
            this.players.push(new Player(i));
        this.tunnel.players = this.players;
    }

    get playersInTunnel():Player[] {
        return this.tunnel.players;
    }

    get allPlayersMadeChoice():boolean {
        return !(this.playersInTunnel.find(player=>player.choice == Choice.NotSelected))
    }

    public *start():IterableIterator<Event>{
        this.round = 1;
        yield* this.startRound();
    }

    public *startRound():IterableIterator<Event>{
        console.log('----- current round:' + this.round + '-----');
        this.putCardsBackIntoDeck();
        this.resetHazardCardCounter();
        this.addArtifactCardAndShuffleDeck();
        this.makePlayersEnterTunnel();
        this.turn = 1;
        yield* this.startTurn();
    }

    public *startTurn():IterableIterator<Event> {
        this.resetPlayersChoice();
        this.putCardInTunnel();
        yield* this.triggerLastCardInTunnel();
        if(this.forceExplore)
            yield* this.forceAllPlayersExplore();
    }

    public *triggerLastCardInTunnel(): IterableIterator<Event> {
        yield this.tunnel.lastCard.trigger(this);
        if(this.tunnel.noPlayers)
            yield* this.endRound();
    }

    public *forceAllPlayersExplore(): IterableIterator<Event> {
        this.forceExplore = false;
        this.playersInTunnel.forEach(player=>player.choice = Choice.KeepGoing)
        yield new AllPlayersMadeChoiceEvent(this);
        yield* this.endTurn();
    }

    public *makeChoice(player: Player, choice: Choice) {
        player.choice = choice;
        yield new PlayerMadeChoiceEvent(player.id);
    
        if (this.allPlayersMadeChoice) {
            yield new AllPlayersMadeChoiceEvent(this);
            yield* this.endTurn();
        }
    }

    public *endTurn(): IterableIterator<Event> {
        yield* this.getAndGo();
        this.turn++;
        yield new Event(EventName.TurnEnd);
    
        if (!this.tunnel.noPlayers) {
            yield* this.startTurn();
            return;
        }

        yield* this.endRound();
    }

    public *getAndGo():IterableIterator<Event> {
        this.distributeResources();
        yield new DistributeGemsAndArtifactsToPlayersEvent(this);
        this.makePlayersLeaveTunnel();
    }

    public *endRound(): IterableIterator<Event> {
        console.log('----- round end -----');
        yield new RoundEndEvent(this);
        this.tunnel.discardCards(this);
        this.tunnel.remove();
        this.round++;
        
        if (this.round <= 5) {
            yield* this.startRound();
            return;
        }
    
        yield* this.end();
    }

    public *end(): IterableIterator<Event> {
        this.winnerID = this.findWinner()?.id || 0;
        this.gameover = true;
        yield new GameoverEvent(this);
    }

    public putCardsBackIntoDeck(): void {
        this.tunnel.cards.forEach(card=>{ this.deck.appendCard(card) });
        this.tunnel.cards = [];
    }

    public resetHazardCardCounter(): void {
        hazardNames.forEach(name=>this.hazardCardCounter[name]=0);
    }

    public addArtifactCardAndShuffleDeck(): void {
        this.deck.appendCard(new ArtifactCard(artifactName[this.round],artifactPoints[this.round]));
        this.deck.shuffle();
    }

    public makePlayersEnterTunnel(): void {
        this.players.forEach(player=>player.enterTunnel());
    }

    public resetPlayersChoice(): void {
        this.playersInTunnel.forEach(player=>player.choice = Choice.NotSelected);
    }

    public putCardInTunnel(): void {
        var card = this.deck.drawCard()
        if(card) this.tunnel.appendCard(card);
    }

    public findWinner(): Player|void {
        let highestPoints = Math.max(...this.players.map((player) => player.points));
        if(!highestPoints) return;
        let highestPointsPlayers = this.players.filter((player) => player.points === highestPoints);
        
        let maxNumberOfHighestPointsPlayerArtifacts = Math.max(...
            highestPointsPlayers.map((player) => player.artifacts.length)
        );

        highestPointsPlayers = highestPointsPlayers.filter(
            (player) => player.artifacts.length === maxNumberOfHighestPointsPlayerArtifacts
        );
        if(highestPointsPlayers.length===1)
            return highestPointsPlayers[0];
        else
            return;
    }

    public distributeResources(): void {
        this.tunnel.distributeAllGems();
        this.tunnel.distributeArtifactCards();
    }

    public makePlayersLeaveTunnel(): void {
        this.tunnel.leavingPlayers.forEach(player=>player.leaveTunnel());
    }

    public getPlayer(id:number): Player {
        let player =  this.players.find(player=>player.id===id);
        if(player)
            return player
        else
            throw new Error('This player is not in the game.');
    }
}
