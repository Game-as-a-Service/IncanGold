import { Response } from "express";
import StartGameUseCase,{ StartGameInput } from "../../app/useCase/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput } from "../../app/useCase/MakeChoiceUseCase";
import { IncanGoldRepository } from "../../frameworks/data-services/IncanGoldRepository";
import ImplEventBus from "../eventBus/ImplEventBus";

class IncanGoldController {
    private resp: Response;
    constructor(resp:Response) {
        this.resp = resp;
    }

    async StartGameController(input:StartGameInput) {
        const repository = new IncanGoldRepository();
        const useCase = new StartGameUseCase(repository,new ImplEventBus());

        const output = await useCase.execute(input);

        if (output.statusCode === 200) {
            this.resp.status(200).send(output.game);
            return;
        }
        // ... other error handling
    }

    async MakeChoiceController(input:MakeChoiceInput) {
        const repository = new IncanGoldRepository();
        const useCase = new MakeChoiceUseCase(repository,new ImplEventBus());

        const output = await useCase.execute(input);

        if (output.statusCode === 200) {
            this.resp.status(200).send(output.game);
            return;
        }
        // ... other error handling
    }
}