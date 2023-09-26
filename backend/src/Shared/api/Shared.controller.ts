import { IRoomRepository } from "../../Room/app/Repository";
import { IIncanGoldRepository } from "../../IncanGold/app/Repository";
import { IUserRepository } from "../../User/app/Repository";
import { Request, Response } from "express";
import DeleteDataUseCase from "../app/DeleteDataUseCase";

export class SharedController {
    private RoomRepository: new () => IRoomRepository;
    private IncanGoldRepository: new () => IIncanGoldRepository;
    private UserRepository: new () => IUserRepository;
    private deleteDataUseCase: DeleteDataUseCase;

    constructor(
        RoomRepository: new () => IRoomRepository,
        IncanGoldRepository: new () => IIncanGoldRepository,
        UserRepository: new () => IUserRepository
    ) {
        this.RoomRepository = RoomRepository;
        this.IncanGoldRepository = IncanGoldRepository;
        this.UserRepository = UserRepository;
        this.deleteDataUseCase = new DeleteDataUseCase(RoomRepository, IncanGoldRepository, UserRepository);
    }

    deleteUser = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const affected = await this.deleteDataUseCase.deleteUser(userId);
        if (affected)
            res.json({ message: "User deleted successfully." });
        else
            res.json({ message: "User not found." })
    }

    deleteRoom = async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const affected = await this.deleteDataUseCase.deleteRoom(roomId);
        if (affected)
            res.json({ message: "Room & game deleted successfully." });
        else
            res.json({ message: "Room not found." })
    }

    deleteGame = async (req: Request, res: Response) => {
        const { gameId } = req.params;
        const affected = await this.deleteDataUseCase.deleteGame(gameId);
        if (affected)
            res.json({ message: "Game deleted successfully." });
        else
            res.json({ message: "Game not found." })
    }
}