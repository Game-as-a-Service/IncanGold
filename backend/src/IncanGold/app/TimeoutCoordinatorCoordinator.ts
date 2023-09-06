import EnforcePlayerChoicesUseCase, { EnforcePlayerChoicesInput } from "./useCase/EnforcePlayerChoicesUseCase"
import { IIncanGoldRepository } from "./Repository"
import { IEventDispatcher } from "../../Shared/interface/EventDispatcher"

interface GameTask {
    round: number,
    turn: number,
    timeId: number
}

function GameTask(round: number, turn: number, timeId:number):GameTask{
    return {round,turn,timeId};
}

type GameId = string;

export class TimeoutCoordinator {

    private manager: Map<GameId, GameTask>;
    private Repository: new () => IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(Repository: new () => IIncanGoldRepository, eventDispatcher: IEventDispatcher) {
        this.manager = new Map<GameId, GameTask>();
        this.Repository = Repository;
        this.eventDispatcher = eventDispatcher;
    }

    addCountdownTimerTask(enforcePlayerChoicesInput: EnforcePlayerChoicesInput) {
        const { gameId, round, turn } = enforcePlayerChoicesInput;
        if (this.isAheadOfProgress(gameId, round, turn)) {
            const gameTask = this.manager.get(gameId);
            clearTimeout(gameTask.timeId);

            const timeId = setTimeout(async () => {
                const useCase = new EnforcePlayerChoicesUseCase(this.newRepo, this.eventDispatcher);
                await useCase.execute(enforcePlayerChoicesInput);
            }, 4000); // 15000

            this.manager.set(gameId, GameTask(round, turn, Number(timeId)));
        }
    }

    isAheadOfProgress(id: GameId, round: number, turn: number): boolean {
        const gameTask = this.manager.get(id);
        if(!gameTask){
            this.manager.set(id, GameTask(round, turn, 0));
            return true;
        }

        if (round < gameTask.round) return false;

        if (round == gameTask.round && turn <= gameTask.turn)
            return false;

        return true;
    }

    private get newRepo() {
        return new this.Repository();
    }

}