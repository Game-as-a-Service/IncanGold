import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { SocketConnection } from "./src/Shared_infra/socket";
import { MySqlContainer } from "testcontainers";
import { AppDataSource, configDataSource } from "./src/Shared_infra/data-source";
import { AuthRouter } from "./src/User/adapter/Auth.router";
import { RoomRouter } from "./src/Room/adapter/Room.router";

export const bootstrap = async function () {
    const container = await new MySqlContainer()
        .withExposedPorts(3306)
        .withRootPassword('123456')
        .withDatabase('test')
        .start();

    configDataSource(container.getHost(), container.getMappedPort(3306));
    await AppDataSource.initialize();

    const port = 8000;
    const app: Express = express();
    const httpServer = createServer(app);

    app.use(express.json());

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*"); // 或指定具體的來源（Origin）
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    });

    app.use('/auth', AuthRouter());
    app.use('/rooms', RoomRouter());

    app.get("/", (req: Request, res: Response) => {
        res.end("Hellow handsome")
    })

    SocketConnection(httpServer);

    httpServer.listen(port, () => {
        console.log(`listening on port ${port}`)
    })

    return httpServer;
}

// boostrap();


