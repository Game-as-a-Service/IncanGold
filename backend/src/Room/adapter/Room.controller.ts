import CreateRoomUseCase,{CreateRoomInput,CreateRoomOutput} from "../app/usecase/CreateRoomUseCase";
import JoinRoomUseCase,{JoinRoomInput,JoinRoomOutput} from "../app/usecase/JoinRoomUseCase";
import LeaveRoomUseCase,{LeaveRoomInput,LeaveRoomOutput} from "../app/usecase/LeaveRoomUseCase"; 
import ReadyUseCase,{ReadyInput,ReadyOutput} from "../app/usecase/ReadyUseCase";
import CancelReadyUseCase,{CancelReadyInput,CancelReadyOutput} from "../app/usecase/CancelReadyUseCase";
import LockSeatUseCase, {LockSeatInput,LockSeatOutput} from "../app/usecase/LockSeatUseCase";
import UnlockSeatUseCase, {UnlockSeatInput,UnlockSeatOutput} from "../app/usecase/UnlockSeatUseCase";
import ChangeHostUseCase, {ChangeHostInput,ChangeHostOutput} from "../app/usecase/ChangeHostUseCase";
import SetNameUseCase, {SetNameInput,SetNameOutput} from "../app/usecase/setNameUseCase";
import SetPasswordUseCase, {SetPasswordInput,SetPasswordOutput} from "../app/usecase/SetPasswordUseCase";
import type { Request, Response } from "express";
import { IRoomRepository } from "../app/Repository";
import { IEventDispatcher } from "../app/EventDispatcher";
import { RoomEventDispatcher } from "../infra/RoomEventDispatcher";
import { IBroadcaster } from "./IBroadcaster";

export class RoomController {

    private repoClass : new() => IRoomRepository;
    private eventDispatcher: IEventDispatcher;
    private broadcaster: IBroadcaster;

    constructor(repoClass: new() => IRoomRepository, broadcaster:IBroadcaster) {
        this.repoClass = repoClass;
        this.eventDispatcher =  new RoomEventDispatcher();
        this.broadcaster = broadcaster;
    }

    createRoom = async (req: Request, res: Response) =>{
        const { playerId,roomName,password } = req.body as any;
        const input: CreateRoomInput = { playerId,roomName,password }

        const createRoomUseCase = new CreateRoomUseCase(this.newRepo, this.eventDispatcher);
        const output:CreateRoomOutput = await createRoomUseCase.execute(input);
        
        return res.json(output);
    }

    joinRoom = async (req: Request, res: Response) =>{
        const { roomId } = req.params;  
        const { playerId,password } = req.body;
        const input: JoinRoomInput = { roomId,playerId,password };

        const joinRoomUseCase = new JoinRoomUseCase(this.newRepo, this.eventDispatcher);
        const output:JoinRoomOutput = await joinRoomUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    leaveRoom = async (req: Request, res: Response) =>{
        const { roomId,playerId } = req.params;  
        const input: LeaveRoomInput = { roomId,playerId };

        const leaveRoomUseCase = new LeaveRoomUseCase(this.newRepo, this.eventDispatcher);
        const output:LeaveRoomOutput = await leaveRoomUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    
    }

    ready = async (req: Request, res: Response) =>{
        const { roomId } = req.params;  
        const { playerId } = req.body; 
        const input: ReadyInput = { roomId,playerId };

        const readyUseCase = new ReadyUseCase(this.newRepo);
        const output:ReadyOutput = await readyUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    cancelReady = async (req: Request, res: Response) =>{
        const { roomId } = req.params;  
        const { playerId } = req.body; 
        const input: CancelReadyInput = { roomId,playerId };

        const cancelReadyUseCase = new CancelReadyUseCase(this.newRepo);
        const output:CancelReadyOutput = await cancelReadyUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    lockSeat = async (req: Request, res: Response) =>{
        const { roomId,seatNumber} = req.params;
        const input: LockSeatInput = { roomId,seatNumber:Number(seatNumber) };

        const lockSeatUseCase = new LockSeatUseCase(this.newRepo);
        const output:LockSeatOutput = await lockSeatUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);

    }

    unlockSeat = async (req: Request, res: Response) =>{
        const { roomId,seatNumber} = req.params;
        const input: UnlockSeatInput = { roomId,seatNumber:Number(seatNumber) };

        const unlockSeatUseCase = new UnlockSeatUseCase(this.newRepo);
        const output:UnlockSeatOutput = await unlockSeatUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    changeHost = async (req: Request, res: Response) =>{
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: ChangeHostInput = { roomId,playerId };

        const changeHostUseCase = new ChangeHostUseCase(this.newRepo);
        const output:ChangeHostOutput = await changeHostUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    setName =  async (req: Request, res: Response) =>{
        const { roomId } = req.params;
        const { roomName } = req.body;
        const input: SetNameInput = { roomId,roomName };

        const setNameUseCase = new SetNameUseCase(this.newRepo);
        const output:SetNameOutput = await setNameUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    setPassword = async (req: Request, res: Response) =>{
        const { roomId } = req.params;
        const { password } = req.body;
        const input: SetPasswordInput = { roomId,password };

        const setPasswordUseCase = new SetPasswordUseCase(this.newRepo);
        const output:SetPasswordOutput = await setPasswordUseCase.execute(input);

        this.broadcaster.broadcast(roomId,output);
        res.sendStatus(200);
    }

    private get newRepo() {
        return new this.repoClass();
    }
}