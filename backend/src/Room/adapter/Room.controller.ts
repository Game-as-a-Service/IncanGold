import StartGameUseCase, { StartGameInput } from "../app/usecase/StartGameUseCase";
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
import ListRoomsUseCase from "../app/usecase/ListRoomsUseCase";
import type { Request, Response } from "express";
import { IRoomRepository } from "../app/Repository";
import { IEventDispatcher } from "../../Shared/app/Interface/EventDispatcher";

export class RoomController {

    private repoClass: new () => IRoomRepository;
    private eventDispatcher: IEventDispatcher;

    constructor(repoClass: new () => IRoomRepository, eventDispatcher: IEventDispatcher) {
        this.repoClass = repoClass;
        this.eventDispatcher = eventDispatcher;
    }

    startGame = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const input: StartGameInput = { roomId };
        const startGameUseCase = new StartGameUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(startGameUseCase, input, res);
    }

    createRoom = async (req: Request, res: Response) => {
        const { playerId, roomName, password } = req.body as any;
        const input: CreateRoomInput = { playerId, roomName, password };
        const createRoomUseCase = new CreateRoomUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(createRoomUseCase, input, res);
    }

    joinRoom = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId, password } = req.body;
        const input: JoinRoomInput = { roomId, playerId, password };
        const joinRoomUseCase = new JoinRoomUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(joinRoomUseCase, input, res);
    }

    leaveRoom = async (req: Request, res: Response) => {
        const { roomId, playerId } = req.params;
        const input: LeaveRoomInput = { roomId, playerId };
        const leaveRoomUseCase = new LeaveRoomUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(leaveRoomUseCase, input, res);
    }

    ready = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: ReadyInput = { roomId, playerId };
        const readyUseCase = new ReadyUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(readyUseCase, input, res);
    }

    cancelReady = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: CancelReadyInput = { roomId, playerId };
        const cancelReadyUseCase = new CancelReadyUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(cancelReadyUseCase, input, res);
    }

    lockSeat = async (req: Request, res: Response) => {
        const { roomId, seatNumber } = req.params;
        const input: LockSeatInput = { roomId, seatNumber: Number(seatNumber) };
        const lockSeatUseCase = new LockSeatUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(lockSeatUseCase, input, res);
    }

    unlockSeat = async (req: Request, res: Response) => {
        const { roomId, seatNumber } = req.params;
        const input: UnlockSeatInput = { roomId, seatNumber: Number(seatNumber) };
        const unlockSeatUseCase = new UnlockSeatUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(unlockSeatUseCase, input, res);
    }

    changeHost = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { playerId } = req.body;
        const input: ChangeHostInput = { roomId, playerId };
        const changeHostUseCase = new ChangeHostUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(changeHostUseCase, input, res);
    }

    setName = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { roomName } = req.body;
        const input: SetNameInput = { roomId, roomName };
        const setNameUseCase = new SetNameUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(setNameUseCase, input, res);
    }

    setPassword = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { password } = req.body;
        const input: SetPasswordInput = { roomId, password };
        const setPasswordUseCase = new SetPasswordUseCase(this.newRepo, this.eventDispatcher);
        await this.execute(setPasswordUseCase, input, res);
    }

    allRooms = async (req: Request, res: Response) => {
        const listRoomsUseCase = new ListRoomsUseCase(this.newRepo);
        const rooms = await listRoomsUseCase.execute();
        res.json(rooms);
    }

    private async execute(useCase: any, input: any, res: Response) {
        try {
            await useCase.execute(input);
            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    private get newRepo() {
        return new this.repoClass();
    }
}