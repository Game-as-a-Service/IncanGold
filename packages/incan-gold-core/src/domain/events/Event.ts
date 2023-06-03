export default class Event {
    public name:EventName;

    constructor(name:EventName){
        this.name = name;
    }
}

export enum EventName {
    NewTurnTreasureCardTriggered = 'NewTurnTreasureCardTriggered',
    NewTurnHazardCardTriggered = 'NewTurnHazardCardTriggered',
    NewTurnArtifactCardTriggered = 'NewTurnArtifactCardTriggered',
    PlayerMadeChoice = 'PlayerMadeChoice',
    AllPlayersMadeChoice = 'AllPlayersMadeChoice',
    DistributeGemsAndArtifactsToPlayers = 'DistributeGemsAndArtifactsToPlayers',
    RoundEnd ='RoundEnd',
    TurnEnd = 'TurnEnd',
    Gameover = 'Gameover',
}
