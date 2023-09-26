import { IIncanGoldRepository } from "../../IncanGold/app/Repository";
import { IRoomRepository } from "../../Room/app/Repository";
import { IUserRepository } from "../../User/app/Repository";
import { Output } from "../../IncanGold/app/Dto/UseCaseOutput";
import { IEventDispatcher } from "./Interface/EventDispatcher";
import { substitute } from "../../IncanGoldForFrontendDev/app/Substitute";

export default class DeleteDataUseCase {
    private RoomRepository: new () => IRoomRepository;
    private IncanGoldRepository: new () => IIncanGoldRepository;
    private UserRepository: new () => IUserRepository;

    constructor(
        RoomRepository: new () => IRoomRepository,
        IncanGoldRepository: new () => IIncanGoldRepository,
        UserRepository: new () => IUserRepository,
    ) {
        this.IncanGoldRepository = IncanGoldRepository;
        this.RoomRepository = RoomRepository;
        this.UserRepository = UserRepository;
    }

    async deleteUser(userId: string): Promise<number> {
        const userRepository = new this.UserRepository;
        const affected = await userRepository.deleteById(Number(userId));
        return affected;
    }

    async deleteRoom(roomId: string): Promise<number> {
        const roomRepository = new this.RoomRepository;
        const affected = await roomRepository.deleteById(roomId);
        await this.deleteGame(roomId);
        return affected;
    }

    async deleteGame(gameId: string): Promise<number> {
        const incanGoldRepository = new this.IncanGoldRepository;
        const affected = await incanGoldRepository.deleteById(gameId);
        return affected;
    }
}