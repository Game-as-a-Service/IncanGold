import { Router } from "express";
import { AuthController } from "./Auth.controller";
import { UserRepository } from "../infra/UserRepository";
import { authenticate } from './Authenticate';

export function AuthRouter() {

    const router = Router();
    const controller = new AuthController(new UserRepository());

    // login
    router.post('/login', controller.login);

    // register
    router.post('/register', controller.register);

    // get user's information
    router.get('/me', authenticate, controller.userInformation);

    return router;
}
