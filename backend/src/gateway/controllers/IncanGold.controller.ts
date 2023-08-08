import StartGameUseCase,{ StartGameInput } from "app/IncanGold/useCase/StartGameUseCase";
import MakeChoiceUseCase, { MakeChoiceInput,MakeChoiceOutput } from "app/IncanGold/useCase/MakeChoiceUseCase";
import { IIncanGoldRepository } from "app/IncanGold/Repository";


export class IncanGoldController {

    private _repoClass: new()=> IIncanGoldRepository;

    constructor(repoClass: new()=> IIncanGoldRepository){
        this._repoClass = repoClass;
    }

    async StartGame(input:StartGameInput) {
        const useCase = new StartGameUseCase(new this._repoClass());
        return await useCase.execute(input);
        
    }

    async MakeChoice(input:MakeChoiceInput) {
        const useCase = new MakeChoiceUseCase(new this._repoClass());
        let result: MakeChoiceOutput;
        try{
            result = await useCase.execute(input);
        }catch(err){
            // todo : handle error;
            result = await useCase.execute(input);
        }
        return result
    }
}