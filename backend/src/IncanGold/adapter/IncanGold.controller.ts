import type { Request, Response } from "express";
import StartGameUseCase, { StartGameInput, StartGameOutput } from "../app/useCase/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput, MakeChoiceOutput } from "../app/useCase/MakeChoiceUseCase";
import { IIncanGoldRepository } from "../app/Repository";
import { IBroadcaster } from "./IBroadcaster";


export class IncanGoldController {

    private Repository: new () => IIncanGoldRepository;
    private broadcaster: IBroadcaster;

    constructor(Repository: new () => IIncanGoldRepository, broadcaster: IBroadcaster) {
        this.Repository = Repository;
        this.broadcaster = broadcaster;
    }

    StartGame = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerIds } = req.body;
        const input: StartGameInput = { roomId, playerIds };

        const createRoomUseCase = new StartGameUseCase(this.newRepo);
        const output: StartGameOutput = await createRoomUseCase.execute(input);

        this.broadcaster.broadcast(roomId, output);
        res.sendStatus(200);
    }

    MakeChoice = async (req: Request, res: Response) => {
        const { gameId } = req.params;
        const { explorerId, choice } = req.body;
        const input: MakeChoiceInput = { gameId, explorerId, choice };

        const makeChoiceUseCase = new MakeChoiceUseCase(this.newRepo);
        let output: MakeChoiceOutput;

        let pass = false;
        while (!pass) {
            try {
                output = await makeChoiceUseCase.execute(input);
                pass = true;
            } catch (err){
                console.log(err);
            }
        }

        // try {
        //     output = await makeChoiceUseCase.execute(input);
        // } catch (err) {
        //     output = await makeChoiceUseCase.execute(input);
        // }

        this.broadcaster.broadcast(gameId, output);
        res.sendStatus(200);
    }

    private get newRepo() {
        return new this.Repository();
    }
}