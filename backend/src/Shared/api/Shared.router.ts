import { Router } from "express";
import { SharedController } from "./Shared.controller";
import { IncanGoldRepository } from "../../IncanGold/infra/IncanGoldRepository";
import { RoomRepository } from "../../Room/infra/RoomRepository";
import { UserRepository } from "../../User/infra/UserRepository";


export function SharedRouter() {

    const router = Router();
    const controller = new SharedController(RoomRepository, IncanGoldRepository, UserRepository);

    router.delete('/games/:gameId', controller.deleteGame)

    router.delete('/rooms/:roomId', controller.deleteRoom);

    router.delete('/users/:userId', controller.deleteUser);

    return router;
}