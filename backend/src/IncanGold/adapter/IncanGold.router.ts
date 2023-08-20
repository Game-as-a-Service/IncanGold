import { Router } from "express";
import { IncanGoldController } from "./IncanGold.controller";
import { IncanGoldRepository } from "../infra/IncanGoldRepository";
import { Broadcaster } from "../../Shared_infra/Broadcaster";


export function IncanGoldRouter() {

    const router = Router();
    const controller = new IncanGoldController(IncanGoldRepository, new Broadcaster);

    // startGame
    router.post('/:roomId/start', controller.StartGame);

    // makeChoice
    router.patch('/:gameId/choice',controller.MakeChoice);

    return router;
}