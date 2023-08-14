import { IncanGold,Explorer,Card,TreasureCard,ArtifactCard } from "../../domain/IncanGold"

export interface GameStatus {
    round: number
    turn: number
    deckLength: number
    explorers: ExplorerDto[]
    tunnel: Room[]
}

export interface ExplorerDto {
    explorerId: string
    inTent: boolean   
    gems: number      
    totalPoints: number 
    artifacts: string[]
}

type cardId = string
export interface Room {
    card : cardId         // 發現的卡
    remainingGems: number // 剩餘的寶石數
    remainingArtifact: boolean 
}

export function toGameStatus(game: IncanGold):GameStatus{
    const gameStatus:GameStatus = {
        round: game.round,
        turn: game.turn,
        deckLength: game.deck.numOfCards,
        explorers: game.explorers.map(explorer=>getexplorerDto(explorer)),
        tunnel: game.tunnel.cards.map(card=>getRoom(card))
    }
    return gameStatus;
}

function getexplorerDto(explorer:Explorer){
    const explorerDto:ExplorerDto = {
        explorerId: explorer.id,
        inTent: explorer.inTent,
        gems: explorer.bag.numOfGems,
        totalPoints: explorer.points,
        artifacts: explorer.tent.artifactsNames
    }
    return explorerDto;
}

function getRoom(card:Card){
    const Room = {
        card : card.cardID,
        remainingGems: (<TreasureCard>card).numOfGems,
        remainingArtifact: (<ArtifactCard>card).isArtifactPresent 
    }
    return Room;
}