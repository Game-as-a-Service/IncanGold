import jwt from "jsonwebtoken";
import { io, Socket } from "socket.io-client";
import { Server } from "http";
import request from 'supertest'

const JWT_SECRET = process.env.JWT_SECRET;
const port = process.env.PORT || 8000;

export class Client {
    public playerId: string;
    public socketClient: Socket | null;
    private server: Server;
    public _socketPromise: Promise<any> | null = null;
    public roomId: string | null = null;
    public records: any[];

    constructor(playerId: string, server: Server) {
        this.playerId = playerId;
        this.server = server;
        this.socketClient = null;
        this.records = [];
    }

    establishConnection = async () => {
        const token = jwt.sign({ userId: this.playerId }, JWT_SECRET);
        this.socketClient = io(`http://localhost:${port}`, { auth: { token } });
        await new Promise((resolve: any) => this.socketClient.on('connect', resolve));
        this._socketPromise = this.makePromise();
    }

    private makePromise() {
        let socketCallback: any;
        const promise = new Promise((resolve: any) => (socketCallback = resolve));
        this.socketClient.on('message', (msg: any) => {
            const event = msg.events.find(e => e.type === "joinRoom");
            if(event) this.roomId = event.data.roomId;
            this.records.push(msg);
            socketCallback(msg);
        });
        return promise;
    }

    get getMessagesFromServer() {
        return this._socketPromise;
    }

    get socketId() {
        return this.socketClient?.id;
    }

    getRoomId(): string {
        const event = (this.records[0].events).find(e => e.type === "joinRoom");
        return event?.data.roomId;
    }

    createRoom = async (roomName: string) => {
        await request(this.server).post("/rooms")
            .send({ playerId: this.playerId, roomName });
    }

    joinRoom = async (roomId: string) => {
        this.roomId = roomId;
        await request(this.server).post(`/rooms/${roomId}/players`)
            .send({ playerId: this.playerId });
    }

    leaveRoom = async () => {
        await request(this.server).delete(`/rooms/${this.roomId}/players/${this.playerId}`)
    }

    ready = async () => {
        await request(this.server).patch(`/rooms/${this.roomId}/ready`)
            .send({ playerId: this.playerId });
    }

    cancelReady = async () => {
        await request(this.server).patch(`/rooms/${this.roomId}/cancelReady`)
            .send({ playerId: this.playerId });
    }

    lockSeat = async (seatNumber: number) => {
        await request(this.server).patch(`/rooms/${this.roomId}/seats/${seatNumber}/lock`)
    }

    unlockSeat = async (seatNumber: number) => {
        await request(this.server).patch(`/rooms/${this.roomId}/seats/${seatNumber}/unlock`)
    }

    changeHost = async (newHostId: string) => {
        await request(this.server).patch(`/rooms/${this.roomId}/host`)
            .send({ playerId: newHostId })
    }

    setName = async (roomName: string) => {
        await request(this.server).patch(`/rooms/${this.roomId}/name`)
            .send({ roomName })
    }

    setPassword = async (password: string) => {
        await request(this.server).patch(`/rooms/${this.roomId}/password`)
            .send({ password })
    }

    startGame = async () => {
        await request(this.server).post(`/rooms/${this.roomId}/start`);
    }

    // ["T1", "T2", "T3", "HS1"]
    startGameForTest = async (hasShuffle: boolean, hasArtifactCard: boolean, cardIds: string[]) => {
        await request(this.server).patch(`/test/${this.roomId}/start`)
            .send({ hasShuffle, hasArtifactCard, cardIds })
    }

    makeChoice = async (choice: string) => {
        await request(this.server).patch(`/games/${this.roomId}/choice`)
            .send({ explorerId: this.playerId, choice });
    }

    makeChoiceForTest = async (choice: string) => {
        await request(this.server).patch(`/test/${this.roomId}/choice`)
            .send({ explorerId: this.playerId, choice });
    }

    enforcePlayerChoicesUseCase = async (round: number, turn: number) => {
        await request(this.server).patch(`/games/${this.roomId}/enforceChoices`)
            .send({ round, turn });
    }

    enforcePlayerChoicesUseCaseForTest = async (round: number, turn: number) => {
        await request(this.server).patch(`/test/${this.roomId}/enforceChoices`)
            .send({ round, turn });
    }
}

export async function createClients(playerIds:string[], server: Server) {
    const clients = playerIds.map(playerId => new Client(playerId, server));
    await Promise.all(clients.map(client => client.establishConnection()));
    return clients;
}

export async function joinRoom(clients: Client[], roomId: string) {
    for (const client of clients)
        await client.joinRoom(roomId);
}

export async function ready(clients: Client[]) {
    for (const client of clients)
        await client.ready();
}

export async function waitSeconds(num: number) {
    return new Promise(resolve => {
        setTimeout(resolve, num * 1000);
    })
}