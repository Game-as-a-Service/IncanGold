import CreateRoomUseCase,{CreateRoomInput,CreateRoomOutput} from "../app/usecase/CreateRoomUseCase";
import { IRoomRepository } from "../app/Repository";
import type { Request, Response } from "express";
import { IEventDispatcher } from "../app/EventDispatcher";
import { RoomEventDispatcher } from "../infra/RoomEventDispatcher";

export class RoomController {

    private repoClass : new() => IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(repoClass: new() => IRoomRepository) {
        this.repoClass = repoClass;
        this.eventDispatcher =  new RoomEventDispatcher();
    }

    createRoom = async (req: Request, res: Response) =>{
        const { playerId,roomName,password } = req.body as any;
        const input: CreateRoomInput = { playerId,roomName,password }

        const repository = new this.repoClass();
        const createRoomUseCase = new CreateRoomUseCase(repository, this.eventDispatcher);
        const output:CreateRoomOutput = await createRoomUseCase.execute(input);
        console.log('controller 24');
        
        return res.json(output);
    }
}