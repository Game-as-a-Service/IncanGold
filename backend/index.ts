import express, { Express, NextFunction, Request, Response, Router } from "express";
import { createServer, Server } from "http";
import { SocketConnection } from "./src/Shared/infra/socket";
import { AppDataSource, configDataSource } from "./src/Shared/infra/data-source";
import { SharedRouter } from "./src/Shared/api/Shared.router";
import { AuthRouter } from "./src/User/api/Auth.router";
import { RoomRouter } from "./src/Room/adapter/Room.router";
import { IncanGoldRouter } from "./src/IncanGold/adapter/IncanGold.router";
import dotenv from 'dotenv';
dotenv.config();

class Bootstrap {
    private readonly app: Express;
    public readonly httpServer: Server;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.app.use(express.json());
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const { path, params, body, method } = req;
            console.log(`path : ${path}, method:${method}`)
            console.log(`params : ${JSON.stringify(params)}`)
            console.log(`body : ${JSON.stringify(body)}`)
            next();
        })

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader("Access-Control-Allow-Origin", "*"); // 或指定具體的來源（Origin）
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS,DELETE,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            next();
        });
    }

    start = async function () {
        configDataSource(process.env.DB_HOST, Number(process.env.DB_PORT));
        await AppDataSource.initialize();

        const port = Number(process.env.PORT);
        this.app.get("/", (req: Request, res: Response) => {
            res.status(200).json({
                status: "success",
                message: "Hello! Hansen_boii!",
            });
        })

        this.app.use('/users', AuthRouter());
        this.app.use('/rooms', RoomRouter());
        this.app.use('/games', IncanGoldRouter())
        this.app.use('', SharedRouter())

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            console.log('Time: ', new Date())
            next();
        })

        SocketConnection(this.httpServer);

        this.httpServer.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    }

    use(path: string, router: Router) {
        this.app.use(path, router);
    }

    close() {
        this.httpServer.close()
    }
}

export const bootstrap = new Bootstrap();


// export const bootstrap = async function () {
//     configDataSource(process.env.DB_HOST, Number(process.env.DB_PORT));
//     await AppDataSource.initialize();

//     const port = Number(process.env.PORT);
//     // const app: Express = express();
//     // const httpServer = createServer(app);

//     app.use(express.json());

//     app.use((req, res, next) => {
//         res.setHeader("Access-Control-Allow-Origin", "*"); // 或指定具體的來源（Origin）
//         res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
//         res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//         next();
//     });

//     app.use('/auth', AuthRouter());
//     app.use('/rooms', RoomRouter());
//     app.use('/games', IncanGoldRouter())
//     app.use('/test', IncanGoldRouterForFrontendDev())

//     app.get("/", (req: Request, res: Response) => {
//         res.end("Hello! Hansen_boii!")
//     })

//     SocketConnection(httpServer);

//     httpServer.listen(port, () => {
//         console.log(`listening on port ${port}`)
//     })

//     return httpServer;
// }