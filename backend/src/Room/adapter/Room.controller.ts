import CreateRoomUseCase, { CreateRoomInput } from "../app/usecase/CreateRoomUseCase";
import JoinRoomUseCase, { JoinRoomInput } from "../app/usecase/JoinRoomUseCase";
import LeaveRoomUseCase, { LeaveRoomInput } from "../app/usecase/LeaveRoomUseCase";
import ReadyUseCase, { ReadyInput } from "../app/usecase/ReadyUseCase";
import CancelReadyUseCase, { CancelReadyInput } from "../app/usecase/CancelReadyUseCase";
import LockSeatUseCase, { LockSeatInput } from "../app/usecase/LockSeatUseCase";
import UnlockSeatUseCase, { UnlockSeatInput } from "../app/usecase/UnlockSeatUseCase";
import ChangeHostUseCase, { ChangeHostInput } from "../app/usecase/ChangeHostUseCase";
import SetNameUseCase, { SetNameInput } from "../app/usecase/setNameUseCase";
import SetPasswordUseCase, { SetPasswordInput } from "../app/usecase/SetPasswordUseCase";
import type { Request, Response } from "express";
import { IRoomRepository } from "../app/Repository";
import { IEventDispatcher } from "../../Shared/interface/EventDispatcher";
import { RoomEventDispatcher } from "../infra/RoomEventDispatcher";

export class RoomController {

    private repoClass: new () => IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(repoClass: new () => IRoomRepository, eventDispatcher:IEventDispatcher) {
        this.repoClass = repoClass;
        this.eventDispatcher = eventDispatcher;
    }

    createRoom = async (req: Request, res: Response) => {
        const { playerId, roomName, password } = req.body as any;
        const input: CreateRoomInput = { playerId, roomName, password }

        const createRoomUseCase = new CreateRoomUseCase(this.newRepo, this.eventDispatcher);
        await createRoomUseCase.execute(input);

        res.sendStatus(200);
    }

    joinRoom = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId, password } = req.body;
        const input: JoinRoomInput = { roomId, playerId, password };

        const joinRoomUseCase = new JoinRoomUseCase(this.newRepo, this.eventDispatcher);
        await joinRoomUseCase.execute(input);

        res.sendStatus(200);
    }

    leaveRoom = async (req: Request, res: Response) => {
        const { roomId, playerId } = req.params;
        const input: LeaveRoomInput = { roomId, playerId };

        const leaveRoomUseCase = new LeaveRoomUseCase(this.newRepo, this.eventDispatcher);
        await leaveRoomUseCase.execute(input);

        res.sendStatus(200);
    }

    ready = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: ReadyInput = { roomId, playerId };

        const readyUseCase = new ReadyUseCase(this.newRepo, this.eventDispatcher);
        await readyUseCase.execute(input);

        res.sendStatus(200);
    }

    cancelReady = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: CancelReadyInput = { roomId, playerId };

        const cancelReadyUseCase = new CancelReadyUseCase(this.newRepo, this.eventDispatcher);
        await cancelReadyUseCase.execute(input);

        res.sendStatus(200);
    }

    lockSeat = async (req: Request, res: Response) => {
        const { roomId, seatNumber } = req.params;
        const input: LockSeatInput = { roomId, seatNumber: Number(seatNumber) };

        const lockSeatUseCase = new LockSeatUseCase(this.newRepo, this.eventDispatcher);
        await lockSeatUseCase.execute(input);

        res.sendStatus(200);
    }

    unlockSeat = async (req: Request, res: Response) => {
        const { roomId, seatNumber } = req.params;
        const input: UnlockSeatInput = { roomId, seatNumber: Number(seatNumber) };

        const unlockSeatUseCase = new UnlockSeatUseCase(this.newRepo, this.eventDispatcher);
        await unlockSeatUseCase.execute(input);

        res.sendStatus(200);
    }

    changeHost = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: ChangeHostInput = { roomId, playerId };

        const changeHostUseCase = new ChangeHostUseCase(this.newRepo, this.eventDispatcher);
        await changeHostUseCase.execute(input);

        res.sendStatus(200);
    }

    setName = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { roomName } = req.body;
        const input: SetNameInput = { roomId, roomName };

        const setNameUseCase = new SetNameUseCase(this.newRepo, this.eventDispatcher);
        await setNameUseCase.execute(input);

        res.sendStatus(200);
    }

    setPassword = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { password } = req.body;
        const input: SetPasswordInput = { roomId, password };

        const setPasswordUseCase = new SetPasswordUseCase(this.newRepo, this.eventDispatcher);
        await setPasswordUseCase.execute(input);

        res.sendStatus(200);
    }

    private get newRepo() {
        return new this.repoClass();
    }
}