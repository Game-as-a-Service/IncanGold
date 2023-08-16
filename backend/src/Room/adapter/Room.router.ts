import { Router,Request,Response } from "express";
import { RoomController } from "./Room.controller";
import { RoomRepository } from "../infra/RoomRepository";

export function RoomRouter() {

    const router = Router();
    const controller = new RoomController(RoomRepository);

    // createRoom
    router.post('/', controller.createRoom);

    // joinRoom
    router.post('/:roomId/players',controller.joinRoom);

    return router;
}
