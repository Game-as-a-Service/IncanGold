import express, { Express, Request, Response } from "express";
import { createServer } from "http";
// import { Server, Socket } from "socket.io";
import setupSocket from "./gateway/socket";
import { MySqlContainer } from "testcontainers";
import { AppDataSource, configDataSource } from "./frameworks/data-services/orm/data-source";
(async function(){
    const container = await new MySqlContainer()
    .withExposedPorts(3306)
    .withRootPassword('123456')
    .withDatabase('test')
    .start();

    configDataSource(container.getHost(),container.getMappedPort(3306));
    await AppDataSource.initialize();
    const port = 8000;
const app:Express = express();
const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//       origin: "*", // 允許的來源
//       methods: ["GET", "POST"], // 允許的 HTTP 方法
//       allowedHeaders: ["Content-Type"], // 允許的標頭
//       credentials: true, // 啟用凭證（例如 cookies）
//     },
//   });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // 或指定具體的來源（Origin）
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

app.get("/", (_req: Request, res: Response) => {
    console.log("get /");
    res.end("Hellow handsome")
})

setupSocket(server)

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})
})()



