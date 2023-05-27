export interface Event {
    name:string;
    data:any;
}

// 幾號玩家已做出選擇
export interface PlayerMadeChoiceEvent extends Event{
    name:'PlayerMadeChoice';
    data:{
        playerWhoMadeChoice:number; 
    }
}

// 通道中所有玩家皆已做出選擇
export interface AllPlayersMadeChoiceEvent extends Event{
    name:'AllPlayersMadeChoice';
    data:{
        allPlayersChoices: Record<number, string>;
    }
}

// 遊戲寄出『選擇』，要求通道中的玩家們做決定
export interface AskPlayersToMakeChoiceEvent extends Event{
    name:'AskPlayersToMakeChoice'|'NoChoice';
    data:{
        allPlayersInTunnel: number[];
    }
}

// 新回合已開始，且放入通道中的寶物卡已觸發效果
export interface NewTurnTreasureCardTriggeredEvent extends Event{
    name:'NewTurnTreasureCardTriggered';
    data:{
        currentTurn:number;
        cardPoints : number;
        numberOfGemsInBag : number;
        numberOfGemsOnCard : number;
    }
}

// 新回合已開始，且放入通道中的災難卡已觸發效果
export interface NewTurnHazardCardTriggeredEvent extends Event{
    name:'NewTurnHazardCardTriggered';
    data:{
        currentTurn:number;
        cardName : string;
        forcePlayersToLeave : boolean|null;
    }
}

// 新回合已開始，且放入通道中的神器卡已觸發效果
export interface NewTurnArtifactCardTriggeredEvent extends Event{
    name:'NewTurnArtifactCardTriggered';
    data:{
        currentTurn:number;
        cardName : string;
        cardPoints : number;
    }
}

// 已分配寶石和神器給要離開的玩家們
export interface AllocatedGemsAndArtifactsToPlayersEvent extends Event{
    name:'AllocatedGemsAndArtifactsToPlayer';
    data:{
        leavingplayersID: number[];        // 離開的玩家們
        artifactsInBag: string[];   // 背包中的神器
        numberOfGemsInBag: number;  // 背包中的寶石數
        numberOfGemsOnCard:Record<number, number> // 通道中卡片上剩下的寶石數
    }
}

// 回合結束
export interface RoundEndEvent extends Event{
    name:'RoundEnd';
    data:{
        discardedHazardCard : string ; // 要被丟棄的進廢棄牌堆的災難卡
    }
}

// 把通道中的卡收集回牌堆，新回合開始
export interface PutCardsBackIntoDeckAndRoundStartEvent extends Event{
    name: 'PutCardsBackIntoDeckAndRoundStart',
    data:{ 
        currentRound : number; 
    }
}

// 遊戲已結束
export interface GameoverEvent extends Event{
    name: 'Gameover',
    data:{ 
        winnerID : number; 
    }
}