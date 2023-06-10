import express, { Express, Request, Response } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./app/swagger.json";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const port = 8000;
const app: Express = express();

app.get("/", (_req: Request, res: Response) => {
  res.end("Hellow world");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
