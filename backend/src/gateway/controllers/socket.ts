import type { Server, Socket, } from "socket.io";
import { IncanGoldController } from "./IncanGold.controller";
import { IncanGoldRepository } from "frameworks/data-services/IncanGold/IncanGoldRepository";

export default async function setupSocket(io:Server,socket:Socket){

    const incanGoldController = new IncanGoldController(IncanGoldRepository)

    // io.on("connection", (socket: Socket) => {
        socket.on("create_room", (playerId:string, roomId:string) => {  
            socket.join(roomId);
            // todo : service : 讓 playerId 加入 room(roomId);
            io.to(roomId).emit("room_created",`room ${roomId} is created by ${playerId}.`);
        })

        socket.on("join_room", (playerId:string, roomId:string) => {
            socket.join(roomId);
            // todo : service : 讓 playerId 加入 room(roomId);
            io.to(roomId).emit("joined",`${playerId} join room: ${roomId}`);
        })
        
        socket.on("message", (msg: string) => {
            console.log(`message: ${msg}`);
            io.emit("message", 'get your message');
        })
        
        socket.on("disconnect", () => {
            console.log(`server : user(${socket.id}) disconnected`);
        })
    
        socket.on("player_choice",async (choise) => {
            console.log(`message: ${choise}`);
            io.emit("message", 'get your choise');
            // io.emit('update_game_status', mockValue)
            io.emit('update_game_status', await incanGoldController.MakeChoice(choise))
        })

        socket.on("start_game", async (payload) => {
            console.log(`message: ${JSON.stringify(payload)}`);
            io.emit("message", await incanGoldController.StartGame({ roomID:payload.gameId, plyerIDs: payload.playerId}));
        })
        socket.on("player_ready", (payload) => {
            console.log(`message: ${JSON.stringify(payload)}`);
            io.emit("message", 'get player_ready');
        })
        
    // })
}