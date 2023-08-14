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

    const jwtMiddleware = (socket: Socket, next: (err?: Error) => void) => {
        const token = socket.handshake.auth.token;

        if (!token) return next(new Error('No token'));

        // 驗證 JWT 
        const user = jwt.verify(token,JWT_SECRET);
        const id:string = (user as any).userId;
        (socket as any).userId = id;
        next();
    }

    io.use(jwtMiddleware);

    io.on('connect', (socket) => {
        SocketManager.manger.add(socket);
    });
}


type playerId = string

export class SocketManager {
    private static socketManager: SocketManager | null = null;
    private _io: Server | null = null;
    private sockets: Map<playerId, Socket>;

    private constructor() {
        this.sockets = new Map<playerId, Socket>();
    }

    add(socket: Socket) {
        this.sockets.set((socket as any).userId, socket);
    }

    get(id: playerId) {
        return this.sockets.get(id);
    }

    set io(io: Server) {
        this._io = io;
    }

    get io(): Server | null {
        return this._io;
    }

    joinRoom(id:playerId,roomId:string){
        this.sockets.get(id).join(roomId);
    }

    leaveRoom(id:playerId,roomId:string){
        this.sockets.get(id).leave(roomId);
    }

    static get manger(): SocketManager {
        if (!this.socketManager) {
            this.socketManager = new SocketManager();
        }
        return this.socketManager;
    }
}