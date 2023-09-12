import { Router } from "express";
import { IncanGoldControllerForFrontendDev } from "./IncanGold.controller";
import { IncanGoldRepository } from "../../IncanGold/infra/IncanGoldRepository";
import { RoomRepository } from "../../Room/infra/RoomRepository";
import { EventDispatcher } from "../../Shared/infra/EventDispatcher";

export function IncanGoldRouterForFrontendDev() {
    const router = Router();
    const incanGoldEventDispatcher = EventDispatcher.dispatcher;
    const controller =
        new IncanGoldControllerForFrontendDev(IncanGoldRepository, RoomRepository, incanGoldEventDispatcher);

    console.log("IncanGoldRouterForTest:", 13);
    console.log(controller.startGame);
    // startGame
    router.patch('/:roomId/start', controller.startGame)

    // makeChoice
    router.patch('/:gameId/choice', controller.makeChoice);

    // enforcePlayerChoices
    router.patch('/:gameId/enforceChoices', controller.enforcePlayerChoices);

    return router;
}