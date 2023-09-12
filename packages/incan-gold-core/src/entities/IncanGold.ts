import ArtifactCard from "./Card/ArtifactCard"
import { hazardNames } from "../constant/CardInfo"
import { TrashDeck, Deck } from "./Deck"
import Tunnel from "./Tunnel"
import { Choice } from "../constant/Choice";
import { EventName } from "../constant/EventName"
import Explorer from "./Explorer"
import { Event } from "../events/Event"
import { RoundEndEvent } from "../events/RoundEndEvent"
import { ExplorerMadeChoiceEvent, AllExplorersMadeChoiceEvent } from "../events/MadeChoiceEvent"
import { DistributeGemsAndArtifactsToExplorersEvent } from "../events/DistributeGemsAndArtifactsToExplorersEvent";
import { GameOverEvent } from "../events/GameOverEvent";
import Card from "./Card/Card";

export default class IncanGold {
    public gameId: string;
    public round: number;
    public turn: number;
    public tunnel: Tunnel;
    public deck: Deck;
    public trashDeck: TrashDeck;
    public explorers: Explorer[] = [];

    public forceExplore: boolean = false;
    public winnerId: string | null = null;
    public gameOver: boolean = false;

    constructor(
        id: string,
        round: number = 0,
        turn: number = 0,
        explorers: Explorer[],
        tunnel: Card[] = [],
        deck: Card[] = [],
        trashDeck: Map<number, Card[]> = new Map()
    ) {
        this.gameId = id;
        this.round = round;
        this.turn = turn;
        this.tunnel = new Tunnel(tunnel);
        this.deck = new Deck(deck);
        this.trashDeck = new TrashDeck(trashDeck);
        this.explorers = explorers;
        this.tunnel.explorers = this.explorers;
    }

    get explorersInTunnel(): Explorer[] {
        return this.tunnel.explorers;
    }

    get allExplorersMadeChoice(): boolean {
        return !(this.explorersInTunnel.find(explorer => (explorer.choice === Choice.NotSelected)))
    }

    public *start(): IterableIterator<Event> {
        this.round = 1;
        yield* this.startRound();
    }

    public *startRound(): IterableIterator<Event> {
        this.putCardsBackIntoDeck();
        this.addArtifactCardAndShuffleDeck();
        this.makeExplorersEnterTunnel();
        this.turn = 1;
        yield* this.startTurn();
    }

    public *startTurn(): IterableIterator<Event> {
        this.resetExplorersChoice();
        this.putCardInTunnel();
        yield* this.triggerLastCardInTunnel();
        if (this.forceExplore)
            yield* this.forceAllExplorersExplore();
    }

    public *triggerLastCardInTunnel(): IterableIterator<Event> {
        yield this.tunnel.lastCard.trigger(this);
        if (this.tunnel.isAnyExplorerPresent == false)
            yield* this.endRound();
    }

    public *forceAllExplorersExplore(): IterableIterator<Event> {
        this.forceExplore = false;
        this.explorersInTunnel.forEach(explorer => explorer.choice = Choice.KeepGoing)
        yield AllExplorersMadeChoiceEvent(this);
        yield* this.endTurn();
    }

    public *makeChoice(explorerId: string, choice: Choice): IterableIterator<Event> {
        const explorer = this.explorersInTunnel.find(e => e.id === explorerId);
        if (!explorer)
            yield Event(EventName.Error, { desc: 'NotFoundInTunnel', explorerId });
        else {
            if (explorer.choice !== Choice.NotSelected)
                yield Event(EventName.Error, { desc: 'AlreadySelected', explorerId });

            explorer.choice = choice;
            yield ExplorerMadeChoiceEvent(explorer.id);

            if (this.allExplorersMadeChoice) {
                yield AllExplorersMadeChoiceEvent(this);
                yield* this.endTurn();
            }
        }
    }

    public *endTurn(): IterableIterator<Event> {
        yield* this.getAndGo();

        const { round, turn } = this;
        yield Event(EventName.TurnEnd, { round, turn });
        this.turn++;

        if (this.tunnel.isAnyExplorerPresent) {
            yield* this.startTurn();
            return;
        }

        yield* this.endRound();
    }

    public *getAndGo(): IterableIterator<Event> {
        this.distributeResources();
        yield DistributeGemsAndArtifactsToExplorersEvent(this);
        this.makeExplorersLeaveTunnel();
    }

    public *endRound(): IterableIterator<Event> {
        this.tunnel.discardCards(this);
        this.tunnel.remove();
        yield RoundEndEvent(this);
        this.round++;

        if (this.round <= 5) {
            yield* this.startRound();
            return;
        }

        yield* this.end();
    }

    public *end(): IterableIterator<Event> {
        const winner = this.findWinner();
        if (winner)
            this.winnerId = winner.id;
        this.gameOver = true;
        yield GameOverEvent(this);
    }

    public *enforcePlayerChoices(): IterableIterator<Event> {
        const unselectedExplorerIds = this.explorersInTunnel
            .filter(explorer => explorer.choice === Choice.NotSelected)
            .map(explorer => explorer.id);
        for (const id of unselectedExplorerIds)
            yield* this.makeChoice(id, Choice.KeepGoing);

    }

    public putCardsBackIntoDeck(): void {
        this.tunnel.cards.forEach(card => { this.deck.appendCard(card) });
        this.tunnel.cards = [];
    }

    public addArtifactCardAndShuffleDeck(): void {
        const cardId = "A" + this.round;
        this.deck.appendCard(new ArtifactCard(cardId));
        this.deck.shuffle();
    }

    public makeExplorersEnterTunnel(): void {
        this.explorers.forEach(explorer => explorer.enterTunnel());
    }

    public resetExplorersChoice(): void {
        this.explorersInTunnel.forEach(explorer => explorer.choice = Choice.NotSelected);
    }

    public putCardInTunnel(): void {
        var card = this.deck.drawCard()
        if (card) this.tunnel.appendCard(card);
    }

    public findWinner(): Explorer | void {
        let highestPoints = Math.max(...this.explorers.map((explorer) => explorer.points));
        if (!highestPoints) return;
        let highestPointsExplorers = this.explorers.filter((explorer) => explorer.points === highestPoints);

        let maxNumberOfHighestPointsExplorerArtifacts = Math.max(...
            highestPointsExplorers.map((explorer) => explorer.numOfArtifacts)
        );

        highestPointsExplorers = highestPointsExplorers.filter(
            (explorer) => explorer.numOfArtifacts === maxNumberOfHighestPointsExplorerArtifacts
        );

        if (highestPointsExplorers.length === 1)
            return highestPointsExplorers[0];
        else
            return;
    }

    public distributeResources(): void {
        this.tunnel.distributeAllGems();
        this.tunnel.distributeArtifacts();
    }

    public makeExplorersLeaveTunnel(): void {
        this.tunnel.leavingExplorers.forEach(explorer => explorer.leaveTunnel());
    }

    public getExplorer(id: string): Explorer {
        let explorer = this.explorers.find(explorer => explorer.id === id);
        if (explorer)
            return explorer
        else
            throw new Error('This Explorer is not in the game.');
    }
}

