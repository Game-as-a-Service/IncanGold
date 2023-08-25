import { Router } from "express";
import { IncanGoldController } from "./IncanGold.controller";
import { IncanGoldRepository } from "../infra/IncanGoldRepository";
import { IncanGoldEventDispatcher } from "../infra/IncanGoldEventDispatcher";


export function IncanGoldRouter() {

    const router = Router();
    const controller = new IncanGoldController(IncanGoldRepository, new IncanGoldEventDispatcher);

    // startGame
    router.post('/:roomId/start', controller.startGame);

    // makeChoice
    router.patch('/:gameId/choice',controller.makeChoice);

    // enforcePlayerChoices
    router.patch('/:gameId/enforceChoices',controller.enforcePlayerChoices);

    return router;
}