import type { Request, Response } from "express";
import StartGameUseCase, { StartGameInput } from "../app/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput } from "../../IncanGold/app/useCase/MakeChoiceUseCase";
import { EnforcePlayerChoicesInput } from "../../IncanGold/app/useCase/EnforcePlayerChoicesUseCase";
import { IIncanGoldRepository } from "../../IncanGold/app/Repository";
import { IRoomRepository } from "../../Room/app/Repository";
import { IEventDispatcher } from "../../Shared/interface/EventDispatcher";
import { TimeoutCoordinator } from "../../IncanGold/app/TimeoutCoordinatorCoordinator";

export class IncanGoldControllerForFrontendDev {

    private RoomRepository: new () => IRoomRepository;
    private Repository: new () => IIncanGoldRepository;
    private eventDispatcher: IEventDispatcher;
    private timeoutCoordinator: TimeoutCoordinator

    constructor(
        Repository: new () => IIncanGoldRepository,
        RoomRepository: new () => IRoomRepository,
        eventDispatcher: IEventDispatcher
    ) {
        this.Repository = Repository;
        this.RoomRepository = RoomRepository;
        this.eventDispatcher = eventDispatcher;
        this.timeoutCoordinator = new TimeoutCoordinator(Repository, eventDispatcher);
    }

    startGame = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { cardIds, hasShuffle, hasArtifactCard } = req.body;
        const input: StartGameInput = { roomId, cardIds, hasShuffle, hasArtifactCard };

        const startGameUseCase = new StartGameUseCase(new this.RoomRepository,this.newRepo, this.eventDispatcher);
        await startGameUseCase.execute(input);
        res.sendStatus(200);
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