import ArtifactCard from "./Card/ArtifactCard"
import { hazardNames,artifactName,artifactPoints } from "../constant/CardInfo"
import {TrashDeck, Deck} from "./Deck"
import Tunnel from "./Tunnel"
import { Choice } from "../constant/Choice";
import { EventName } from "../constant/EventName"
import Player from "./Player"
import Event from "../events/Event"
import RoundEndEvent from "../events/RoundEndEvent"
import {PlayerMadeChoiceEvent,AllPlayersMadeChoiceEvent} from "../events/MadeChoiceEvent"
import DistributeGemsAndArtifactsToPlayersEvent from "../events/DistributeGemsAndArtifactsToPlayersEvent";
import GameoverEvent from "../events/GameoverEvent";
import Card from "./Card/Card";

export default class IncanGold {
    public gameID:string;
    public tunnel:Tunnel;
    public deck:Deck;
    public trashDeck:TrashDeck;
    public players:Player[] = [];

    public hazardCardCounter: Record<string, number> = {};
    public forceExplore:boolean = false;
    public round:number = 0;
    public turn:number = 0;
    public winnerID:string = "";
    public gameover:boolean = false;

    constructor(
        ID:string, 
        playerIDs:string[],
        tunnel:Card[]=[],
        deck:Card[]=[],
        trashDeck:Map<number,Card[]>= new Map())
    {
        this.gameID = ID;
        this.tunnel = new Tunnel(tunnel);
        this.deck = new Deck(deck);
        this.trashDeck = new TrashDeck(trashDeck);

        playerIDs.forEach(playerID=>{
            this.players.push(new Player(playerID));
        })
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
        this.putCardsBackIntoDeck();
        this.resetHazardCardCounter();
        // this.addArtifactCardAndShuffleDeck();
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
        if(this.tunnel.isAnyPlayerPresent == false)
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
    
        if (this.tunnel.isAnyPlayerPresent) {
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
        this.tunnel.discardCards(this);
        this.tunnel.remove();
        yield new RoundEndEvent(this);
        this.round++;
        
        if (this.round <= 5) {
            yield* this.startRound();
            return;
        }
    
        yield* this.end();
    }

    public *end(): IterableIterator<Event> {
        const winner = this.findWinner();
        if(winner)
            this.winnerID = winner.id;
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
        this.deck.appendCard(new ArtifactCard(("A"+this.round) ,artifactName[this.round],artifactPoints[this.round]));
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
            highestPointsPlayers.map((player) => player.numOfArtifacts)
        );

        highestPointsPlayers = highestPointsPlayers.filter(
            (player) => player.numOfArtifacts === maxNumberOfHighestPointsPlayerArtifacts
        );
        if(highestPointsPlayers.length===1)
            return highestPointsPlayers[0];
        else
            return;
    }

    public distributeResources(): void {
        this.tunnel.distributeAllGems();
        this.tunnel.distributeArtifacts();
    }

    public makePlayersLeaveTunnel(): void {
        this.tunnel.leavingPlayers.forEach(player=>player.leaveTunnel());
    }

    public getPlayer(id:string): Player {
        let player =  this.players.find(player=>player.id === id);
        if(player)
            return player
        else
            throw new Error('This player is not in the game.');
    }
}

