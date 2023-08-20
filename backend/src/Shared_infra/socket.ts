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

    // const jwtMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    //     const token = socket.handshake.auth.token;

    //     if (!token) return next(new Error('No token'));

    //     // 驗證 JWT 
    //     const user = jwt.verify(token,JWT_SECRET);
    //     const id:string = (user as any).userId;
    //     // (socket as any).userId = id;
    //     // next();
    // }

    // io.use(jwtMiddleware);

    io.on('connect', (socket) => {
        const token = socket.handshake.auth.token;
        // todo : 處理沒有token的情況
        if (!token)  throw new Error('No token')
        // 驗證 JWT 
        const user = jwt.verify(token,JWT_SECRET);
        const playerId:string = (user as any).userId;
        SocketManager.manger.add(playerId,socket);
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

    add(playerId: PlayerId,  socket: Socket) {
        this.sockets.set(playerId, socket);
        console.log(`server put socket ${socket.id} in socketManger.`);
    }

    get(id: PlayerId) {
        return this.sockets.get(id);
    }

    set io(io: Server) {
        this._io = io;
    }

    get io(): Server | null {
        return this._io;
    }

    joinRoom(id:PlayerId,roomId:string){
        console.log(`player ${id} join socketRoom ${roomId}`)
        console.log(`this player's socketId is ${this.sockets.get(id).id}`)
        this.sockets.get(id).join(roomId);
    }

    leaveRoom(id:PlayerId,roomId:string){
        this.sockets.get(id).leave(roomId);
    }

    static get manger(): SocketManager {
        if (!this.socketManager) {
            this.socketManager = new SocketManager();
        }
        return this.socketManager;
    }
}