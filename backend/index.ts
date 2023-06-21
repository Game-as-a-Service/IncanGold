import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerDocument from "./app/swagger/swagger.json";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
// 添加 Swagger UI

// // -----Swagger 選項設定-----
// const options = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "API Documentation",
//       version: "1.0.0",
//       description: "API documentation for my application",
//     },
//     servers: [
//       { url: "http://localhost:3000" }, // 根據您的應用程式設定進行調整
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//     },
//     security: [{ bearerAuth: [] }],
//   },
//   apis: ["./controllers/*.ts"], // 根據您的路由檔案路徑進行調整
// };
// // 建立 Swagger JSON 文件
// const specs = swaggerJsdoc(options);

// -----使用 Swagger UI 中介軟體提供 Swagger 文件-----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // or swaggerDocument??

// 啟動您的應用程式伺服器
app.listen(3000, () => {
  console.log("App listening on port 3000");
});
