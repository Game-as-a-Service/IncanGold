import { Router,Request,Response } from "express";
import { AuthController } from "./Auth.controller";
import { UserRepository } from "../infra/UserRepository";



export function AuthRouter() {

    const router = Router();
    const controller = new AuthController(new UserRepository());

    // login
    router.post('/login', controller.login);

    return router;
}
