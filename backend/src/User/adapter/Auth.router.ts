import { Router,Request,Response } from "express";
import { AuthController } from "./Auth.controller";
import { UserRepository } from "../infra/UserRepository";


// export class AuthRouter{
//     public router: Router;
//     private controller: AuthController;

//     constructor(){
//         this.router = Router();
//         this.controller = new AuthController(new UserRepository());
        
//         // login
//         this.router.post('/login', this.controller.login);
//     }
// }



export function AuthRouter() {

    const router = Router();
    const controller = new AuthController(new UserRepository());

    // login
    router.post('/login', controller.login);

    return router;
}
