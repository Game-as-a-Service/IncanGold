import Player from '../Player'

interface Card {
  execute(): void;
  getPlayerInTunnel(players: Player[]): void;
}