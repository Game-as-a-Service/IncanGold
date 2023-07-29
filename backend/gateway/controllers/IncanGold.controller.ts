import StartGameUseCase,{ StartGameInput } from "../../app/useCase/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput } from "../../app/useCase/MakeChoiceUseCase";
import { IncanGoldRepository } from "../../frameworks/data-services/IncanGoldRepository";

export class IncanGoldController {

    async StartGame(input:StartGameInput) {
        const repository = new IncanGoldRepository();
        const useCase = new StartGameUseCase(repository);
        return await useCase.execute(input);
    }

    async MakeChoice(input:MakeChoiceInput) {
        const repository = new IncanGoldRepository();
        const useCase = new MakeChoiceUseCase(repository);
        return await useCase.execute(input);
    }
}

export const incanGoldController = new IncanGoldController();