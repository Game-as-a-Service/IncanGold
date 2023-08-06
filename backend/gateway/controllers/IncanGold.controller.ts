import StartGameUseCase,{ StartGameInput } from "../../app/useCase/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput } from "../../app/useCase/MakeChoiceUseCase";
import { IRepository } from "app/Repository";


export class IncanGoldController {

    private _repoClass: new()=> IRepository;

    constructor(repoClass: new()=> IRepository){
        this._repoClass = repoClass;
    }

    async StartGame(input:StartGameInput) {
        const repository = new this._repoClass();
        const useCase = new StartGameUseCase(repository);
        return await useCase.execute(input);
        
    }

    async MakeChoice(input:MakeChoiceInput) {
        const repository = new this._repoClass();
        const useCase = new MakeChoiceUseCase(repository);
        return await useCase.execute(input);
    }
}