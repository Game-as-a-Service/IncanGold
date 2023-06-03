import Event, { EventName } from "./Event";
import IncanGold from "../entities/IncanGold";
import TresasureCard from "../entities/Card/TreasureCard";
import HazardCard from "../entities/Card/HazardCard";
import ArtifactCard from "../entities/Card/ArtifactCard";

// 新回合已開始，且放入通道中的寶物卡已觸發效果
export class NewTurnTreasureCardTriggeredEvent extends Event{
    public readonly currentRound : number;
    public readonly currentTurn : number;
    public readonly cardPoints : number;
    public readonly numberOfGemsOnCard : number;
    public readonly numberOfGemsInBag : number;
    
    constructor(game:IncanGold){
        super(EventName.NewTurnTreasureCardTriggered);
        this.currentRound = game.round;
        this.currentTurn = game.turn;
        this.cardPoints = (<TresasureCard>game.tunnel.lastCard).points;
        this.numberOfGemsInBag = game.playersInTunnel[0].bag.numOfGems;
        this.numberOfGemsOnCard =  (<TresasureCard>game.tunnel.lastCard).numOfGems;
    }
}

// 新回合已開始，且放入通道中的災難卡已觸發效果
export class NewTurnHazardCardTriggeredEvent extends Event{
    public readonly currentRound : number;
    public readonly currentTurn : number;
    public readonly cardName : string;
    public readonly appearsTwice : boolean;

    constructor(game:IncanGold, appearsTwice:boolean){
        super(EventName.NewTurnHazardCardTriggered);
        this.currentRound = game.round;
        this.currentTurn = game.turn;
        this.cardName = (<HazardCard>game.tunnel.lastCard).name;
        this.appearsTwice = appearsTwice;
    }
}

// 新回合已開始，且放入通道中的神器卡已觸發效果
export class NewTurnArtifactCardTriggeredEvent extends Event{
    public readonly currentRound : number;
    public readonly currentTurn:number;
    public readonly cardName : string;
    public readonly cardPoints : number;

    constructor(game:IncanGold){
        super(EventName.NewTurnArtifactCardTriggered);
        this.currentRound = game.round;
        this.currentTurn = game.turn;
        this.cardName = (<ArtifactCard>game.tunnel.lastCard).name;
        this.cardPoints = (<ArtifactCard>game.tunnel.lastCard).points;
    }
}