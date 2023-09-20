import { EventDispatcher } from "../../Shared/infra/EventDispatcher";
import { IEventDispatcher } from "../../Shared/app/Interface/EventDispatcher";
import { SocketManager } from "../../Shared/infra/socket";
import { Output } from "../app/Dto/UseCaseOutput";
import { EventName } from "../domain/IncanGold";
import { t } from "vitest/dist/types-198fd1d9";

export class IncanGoldEventDispatcher implements IEventDispatcher {

    private eventDispatcher: Readonly<EventDispatcher>;

    constructor() {
        this.eventDispatcher = EventDispatcher.dispatcher;

        this.on("IncanGold", async (gameId: string, useCaseOutput: Output) => {
            SocketManager.manger.broadcast(gameId, useCaseOutput);

            const gameOverEvent = useCaseOutput.events.
                find(event => event.name === EventName.GameOver);

            if (gameOverEvent)
                await this.handleGameOverEvent(gameId);
        })
    }

    emit(eventName: string = 'IncanGold', ...args: any[]): boolean {
        return this.eventDispatcher.emit(eventName, ...args);
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventDispatcher.on(eventName, listener);
    }

    private handleGameOverEvent = async (gameId: string) => {
        this.emit("deleteGame", gameId);
        // ROOMSTATE.INGAME -> ROOMSTATE.WAITING
        this.emit("GameOver", gameId);
    }

}