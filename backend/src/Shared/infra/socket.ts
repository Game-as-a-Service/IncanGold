import { Socket, Server } from "socket.io";
import type { Server as httpServer } from "http";
import jwt from 'jsonwebtoken';

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

    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token;
        if (!token)
            socket.emit('message', "說好的token呢?");
            
        // Verify and decode token logic
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const playerId: string = (user as any).userId;
            SocketManager.manger.add(playerId, socket);
        } catch (err) {
            socket.emit('message', "Invalid token");
        }
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
    }

    get(id: PlayerId) {
        return this.sockets.get(id);
    }

    set io(io: Server) {
        this._io = io;
    }

    get io() {
        return this._io;
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