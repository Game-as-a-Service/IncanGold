import { Router } from "express";
import { IncanGoldController } from "./IncanGold.controller";
import { IncanGoldRepository } from "../infra/IncanGoldRepository";
import { IncanGoldEventDispatcher } from "../infra/IncanGoldEventDispatcher";


export function IncanGoldRouter() {

    const router = Router();
    const incanGoldEventDispatcher = new IncanGoldEventDispatcher;
    const controller = new IncanGoldController(IncanGoldRepository, incanGoldEventDispatcher);

    // startGame
    incanGoldEventDispatcher.on('startGame', controller.startGame)

    // makeChoice
    router.patch('/:gameId/choice', controller.makeChoice);

    // enforcePlayerChoices
    router.patch('/:gameId/enforceChoices', controller.enforcePlayerChoices);

    return router;
}