import { Socket, Server } from "socket.io";
import type { Server as httpServer } from "http";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';
export function SocketConnection(httpServer: httpServer) {

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true,
        },
    });

    SocketManager.manger.io = io;

    io.on('connect', (socket) => {
        const token = socket.handshake.auth.token;
        // todo : 處理沒有token的情況
        if (!token) throw new Error('No token')
        // 驗證 JWT 
        const user = jwt.verify(token, JWT_SECRET);
        const playerId: string = (user as any).userId;
        SocketManager.manger.add(playerId, socket);
    });
}


type PlayerId = string

export class SocketManager {
    private static socketManager: SocketManager | null = null;
    private _io: Server | null = null;
    private sockets: Map<PlayerId, Socket>;

    private constructor() {
        this.sockets = new Map<PlayerId, Socket>();
    }

    add(playerId: PlayerId, socket: Socket) {
        this.sockets.set(playerId, socket);
        console.log(`server put socket ${socket.id} in socketManger.`);
    }

    get(id: PlayerId) {
        return this.sockets.get(id);
    }

    set io(io: Server) {
        this._io = io;
    }

    static get manger(): SocketManager {
        this.socketManager = this.socketManager ?? new SocketManager();
        return this.socketManager;
    }

    joinRoom(id: PlayerId, roomId: string) {
        this.sockets.get(id).join(roomId);
    }

    leaveRoom(id: PlayerId, roomId: string) {
        this.sockets.get(id).leave(roomId);
    }

    broadcast(roomId: string, payload: any): void {
        this._io.to(roomId).emit('message', payload);
    }

    unicast(userId: string, payload: any): void {
        const client = SocketManager.manger.get(userId);
        client.emit('message', payload);
    }
}