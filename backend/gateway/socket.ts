import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { IncanGoldController } from "./controllers/IncanGold.controller";

export default function setupSocket(server: HttpServer){
    const mockValue = {
        round: 2,
        turn: 3,
        deckLength: 30,
        trashDeck: 6,
        player: [{
            playerId: 1,
            inTunnel: true, //true: 探索中
            chosen: true, //true: 選擇完畢
            bag: [0,2,1], //每turn所得寶石數
            tent: {
                gems: 6,
                artifacts: ['A1'] 
            },
        },{
            playerId: 2,
            inTunnel: true, //true: 探索中
            chosen: false, //true: 選擇完畢
            bag: [0,2,1], //每turn所得寶石數
            tent: {
                gems: 0,
                artifacts: [] 
            },
        }],
        tunnel: {
            discovers : ['T1','T8','T3'], //每個turn發現的卡
            remainingGems: 5,
            remainingArtifacts: [] 
        },
        choiseTimer: new Date().getTime() + 10000,
    }
    const controller = new IncanGoldController()
    const io = new Server(server, {
        cors: {
            origin: "*", // 允許的來源
            methods: ["GET", "POST"], // 允許的 HTTP 方法
            allowedHeaders: ["Content-Type"], // 允許的標頭
            credentials: true, // 啟用凭證（例如 cookies）
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log("a user connected");
        
        socket.on("message", (msg: string) => {
            console.log(`message: ${msg}`);
            io.emit("message", 'get your message');
        })
        
        socket.on("disconnect", () => {
            console.log("user disconnected");
        })
    
        socket.on("player_choice", (choise) => {
            console.log(`message: ${choise}`);
            io.emit("message", 'get your choise');
            io.emit('update_game_status', mockValue)
        })

        socket.on("start_game", (payload) => {
            console.log(`message: ${JSON.stringify(payload)}`);
            io.emit("message", 'get start_game');
        })
        socket.on("player_ready", (payload) => {
            console.log(`message: ${JSON.stringify(payload)}`);
            io.emit("message", 'get player_ready');
        })
    })

    


}