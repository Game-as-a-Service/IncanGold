import Player from "../Player";

interface Card {
	execute(): void;
	getPlayerInTunnel(players: Player[]): void;
}

export class ICard implements Card {
	execute() {}
	getPlayerInTunnel() {}
}
