import type { Request, Response } from "express";
import StartGameUseCase, { StartGameInput } from "../app/useCase/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput } from "../app/useCase/MakeChoiceUseCase";
import { EnforcePlayerChoicesInput } from "../app/useCase/EnforcePlayerChoicesUseCase";
import { IIncanGoldRepository } from "../app/Repository";
import { IEventDispatcher } from "../../Shared/app/Interface/EventDispatcher";
import { TimeoutCoordinator } from "../app/TimeoutCoordinatorCoordinator";

export class IncanGoldController {

    private Repository: new () => IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;
    private timeoutCoordinator: TimeoutCoordinator

    constructor(Repository: new () => IIncanGoldRepository, eventDispatcher: IEventDispatcher) {
        this.Repository = Repository;
        this.eventDispatcher = eventDispatcher;
        this.timeoutCoordinator = new TimeoutCoordinator(Repository, eventDispatcher);
    }

    startGame = async (data: any) => {
        const { roomId, playerIds } = data;
        const input: StartGameInput = { roomId, playerIds };

        const startGameUseCase = new StartGameUseCase(this.newRepo, this.eventDispatcher);
        await startGameUseCase.execute(input);
    }

    makeChoice = async (req: Request, res: Response) => {
        const { gameId } = req.params;
        const { explorerId, choice } = req.body;
        const input: MakeChoiceInput = { gameId, explorerId, choice };

        const makeChoiceUseCase = new MakeChoiceUseCase(this.newRepo, this.eventDispatcher);
        await makeChoiceUseCase.execute(input);
        res.sendStatus(200);
    }

    enforcePlayerChoices = async (req: Request, res: Response) => {
        const { gameId } = req.params;
        const { round, turn } = req.body;
        const input: EnforcePlayerChoicesInput = { gameId, round, turn };

        this.timeoutCoordinator.addCountdownTimerTask(input);
        res.sendStatus(200);
    }

    private get newRepo() {
        return new this.Repository();
    }
}