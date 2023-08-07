import ArtifactCard from "../../../packages/incan-gold-core/src/domain/entities/Card/ArtifactCard"
import TreasureCard from "../../../packages/incan-gold-core/src/domain/entities/Card/TreasureCard"
import IncanGold from "../../../packages/incan-gold-core/src/domain/entities/IncanGold"
import Player from "../../../packages/incan-gold-core/src/domain/entities/Player"
import Card from "../../../packages/incan-gold-core/src/domain/entities/Card/Card"

export interface GameStatus {
    round: number
    turn: number
    deckLength: number
    players: PlayerDto[]
    tunnel: Room[]
}

export interface PlayerDto {
    playerId: string
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

export function toGameStatus(game:IncanGold):GameStatus{
    const gameStatus:GameStatus = {
        round: game.round,
        turn: game.turn,
        deckLength: game.deck.numOfCards,
        players: game.players.map(player=>getPlayerDto(player)),
        tunnel: game.tunnel.cards.map(card=>getRoom(card))
    }
    return gameStatus;
}

function getPlayerDto(player:Player){
    const playerDto:PlayerDto = {
        playerId: player.id,
        inTent: player.inTent,
        gems: player.bag.numOfGems,
        totalPoints: player.points,
        artifacts: player.tent.artifactsNames
    }
    return playerDto;
}

function getRoom(card:Card){
    const Room = {
        card : card.cardID,
        remainingGems: (<TreasureCard>card).numOfGems,
        remainingArtifact: (<ArtifactCard>card).isArtifactPresent 
    }
    return Room;
}