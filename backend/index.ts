import express, { Express, Request, Response } from "express";

const port = 8000;
const app:Express = express();

app.get("/", (_req: Request, res: Response) => {
    res.end("Hellow world")
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
