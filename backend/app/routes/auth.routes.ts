import express from "express";
import { DataSource } from "typeorm";


import { loginInit } from "../controllers/auth.controller";

const router = express.Router();

const login = loginInit(new DataSource({
    type: "sqlite",
    database: "db.sqlite",}));
router.post("/login", login);

export default router;
