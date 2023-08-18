import { Router } from "express";
import { RoomController } from "./Room.controller";
import { RoomRepository } from "../infra/RoomRepository";

export function RoomRouter() {

    const router = Router();
    const controller = new RoomController(RoomRepository);

    // createRoom
    router.post('/', controller.createRoom);

    // joinRoom
    router.post('/:roomId/players',controller.joinRoom);

    // leaveRoom
    router.delete('/:roomId/players/:playerId',controller.leaveRoom);

    // ready
    router.patch('/:roomId/ready',controller.ready);

    // cancelReady
    router.patch('/:roomId/cancelReady',controller.cancelReady);

    // lockSeat
    router.patch('/:roomId/seats/:seatNumber/lock',controller.lockSeat);

    // unlockSeat
    router.patch('/:roomId/seats/:seatNumber/unlock',controller.unlockSeat);

    // changeHost
    router.patch('/:roomId/host',controller.changeHost);

    // setName
    router.patch('/:roomId/name',controller.setName);

    // setPassword
    router.patch('/:roomId/password',controller.setPassword);

    return router;
}
