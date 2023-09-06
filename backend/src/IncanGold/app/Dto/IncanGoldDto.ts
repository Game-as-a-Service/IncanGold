import type { IncanGold, Explorer, Card, TreasureCard, ArtifactCard } from "../../domain/IncanGold"

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
    card: cardId         // 發現的卡
    remainingGems: number // 剩餘的寶石數
    remainingArtifact: boolean
}

export function toGameStatus(game: IncanGold): GameStatus {
    const { round, turn, deck, explorers, tunnel } = game;
    const { numOfCards: deckLength } = deck;
    const explorersDto = explorers.map(e => toExplorerDto(e));
    const rooms = tunnel.cards.map(card => toRoom(card))
    const gameStatus: GameStatus = generateGameStatus(round, turn, deckLength, explorersDto, rooms);
    Object.freeze(gameStatus);
    return gameStatus;
}

function toExplorerDto(explorer: Explorer): ExplorerDto {
    const { id, inTent, bag, tent, points } = explorer;
    const { numOfGems } = bag;
    const { artifactsNames } = tent;
    return generateExplorerDto(id, inTent, numOfGems, points, artifactsNames)
}

function generateExplorerDto(id: string, inTent: boolean, numOfGems: number, points: number, artifactsNames: string[]): ExplorerDto {
    return {
        explorerId: id,
        inTent: inTent,
        gems: numOfGems,
        totalPoints: points,
        artifacts: artifactsNames
    }
}

function generateGameStatus(round: number, turn: number, deckLength: number, explorers: ExplorerDto[], rooms: Room[]): GameStatus {
    return { round, turn, deckLength, explorers, tunnel: rooms };
}

function toRoom(card: Card): Room {
    return {
        card: card.id,
        remainingGems: (<TreasureCard>card).numOfGems,
        remainingArtifact: (<ArtifactCard>card).isArtifactPresent
    }
}