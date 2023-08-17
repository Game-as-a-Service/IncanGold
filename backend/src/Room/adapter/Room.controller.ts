import CreateRoomUseCase,{CreateRoomInput,CreateRoomOutput} from "../app/usecase/CreateRoomUseCase";
import JoinRoomUseCase,{JoinRoomInput,JoinRoomOutput} from "../app/usecase/JoinRoomUseCase";
import { IRoomRepository } from "../app/Repository";
import type { Request, Response } from "express";
import { IEventDispatcher } from "../app/EventDispatcher";
import { RoomEventDispatcher } from "../infra/RoomEventDispatcher";
import { IBroadcaster } from "./IBroadcaster";
import { Broadcaster } from "../infra/Broadcaster";

export class RoomController {

    private repoClass : new() => IRoomRepository;
    private eventDispatcher: IEventDispatcher;
    private broadcaster: IBroadcaster;

    constructor(repoClass: new() => IRoomRepository) {
        this.repoClass = repoClass;
        this.eventDispatcher =  new RoomEventDispatcher();
        this.broadcaster = new Broadcaster();
    }

    createRoom = async (req: Request, res: Response) =>{
        const { playerId,roomName,password } = req.body as any;
        const input: CreateRoomInput = { playerId,roomName,password }

        const repository = new this.repoClass();
        const createRoomUseCase = new CreateRoomUseCase(repository, this.eventDispatcher);
        const output:CreateRoomOutput = await createRoomUseCase.execute(input);
        
        return res.json(output);
    }

    joinRoom = async (req: Request, res: Response) =>{
        const { roomId } = req.params;  
        const { playerId,password } = req.body;
        const input: JoinRoomInput = { roomId,playerId,password };

        const repository = new this.repoClass();
        const joinRoomUseCase = new JoinRoomUseCase(repository, this.eventDispatcher);
        const output:JoinRoomOutput = await joinRoomUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }
}