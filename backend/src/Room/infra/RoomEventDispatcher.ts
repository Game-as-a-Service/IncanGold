import { EventDispatcher } from "../../Shared/infra/EventDispatcher";
import { IEventDispatcher } from "../../Shared/app/Interface/EventDispatcher";
import { SocketManager } from "../../Shared/infra/socket";
import { Output } from "../app/dto/Output";
import { Event } from "../domain/event/Event";
import GameOverUseCse from "../app/usecase/GameOverUseCse";
import { RoomRepository } from "./RoomRepository";

export class RoomEventDispatcher implements IEventDispatcher {

    private eventDispatcher: Readonly<EventDispatcher>;

    constructor() {
        this.eventDispatcher = EventDispatcher.dispatcher;

        this.on("GameOver", async (gameId: string) => {
            await this.handleGameOverEvent(gameId);
        })

        this.on("room", async (useCaseOutput: Output) => {
            for (let event of useCaseOutput.events) {
                if (event.type === "joinRoom")
                    this.joinRoom(event.data);

                if (event.type === "leaveRoom")
                    this.leaveRoom(event, useCaseOutput.events);

                if (event.type === "noPlayersInRoom")
                    await this.deleteRoom(event.data);

                if (event.type === "startGame")
                    this.emit('startGame', event.data);
            }
            const { id: roomId } = useCaseOutput.room;
            SocketManager.manger.broadcast(roomId, useCaseOutput);
        })
    }

    emit(eventName: string = 'room', ...args: any[]): boolean {
        return this.eventDispatcher.emit(eventName, ...args);
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventDispatcher.on(eventName, listener);
    }

    private joinRoom = (data: any) => {
        const { playerId, roomId } = data;
        SocketManager.manger.joinRoom(playerId, roomId)
    }

    private leaveRoom = (leaveRoomEvent: Event, allEvents: Event[]) => {
        const { playerId, roomId } = leaveRoomEvent.data;
        SocketManager.manger.leaveRoom(playerId, roomId);
        SocketManager.manger.unicast(playerId, { events: allEvents });
    }

    private deleteRoom = async (data: any) => {
        const { roomId } = data;
        // room data
        this.emit('deleteRoom', roomId);
        // socket room
        const { io } = SocketManager.manger;
        const sockets = await io.in(roomId).fetchSockets();
        sockets.forEach(socket => socket.leave(roomId));
    }

    private handleGameOverEvent = async (gameId: string) => {
        try {
            const gameOverUseCse = new GameOverUseCse(new RoomRepository, this);
            await gameOverUseCse.execute(gameId);
        } catch (err) {
            if (err.message === 'Incorrect data version! concurrent modification error!')
                await this.handleGameOverEvent(gameId);
            else
                console.log('RoomEventDispatcher.ts / line 80, err: ', err);
        }
    }
}