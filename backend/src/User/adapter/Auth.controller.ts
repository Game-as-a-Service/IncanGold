import { IUserRepository } from "../app/Repository";
import { IUser } from "../app/User";
import { UserService } from "../app/UserService";
import type { Request, Response } from "express";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';
const GOOGLE_CLIENT_ID = 'google_client_id';

export class AuthController {
    public repo: IUserRepository;
    public userService: UserService;
    public client: OAuth2Client;

    constructor(repository: IUserRepository) {
        this.repo = repository;
        this.userService = new UserService(repository);
        this.client = new OAuth2Client(GOOGLE_CLIENT_ID);
    }

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const user = await this.userService.validate(username, password);
        if (!user)
            return res.status(401).send('wrong user name or password');

        const payload = { userId: user.id };
        const token = jwt.sign(payload, JWT_SECRET);
        res.json({ access_token: token });
    }

    register = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        await this.userService.create(username, password, email);
        res.send('Registration succeeded!');
    }

    google = async (req: Request, res: Response) => {

        // 生成登入頁面連結
        const url = this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['profile', 'email']
        });

        res.redirect(url);
    };

    googleCallback = async (req: Request, res: Response) => {
        const { code } = req.query;

        // 用 code 交換 token
        const { tokens } = await this.client.getToken(String(code));

        // 驗證 token 並取得使用者資訊
        const ticket = await this.client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();

        // 在資料庫中新增或更新使用者
        const user = await this.userService.save(name, null, email);

        // 生成JWT Payload
        const { id, username } = user;
        const payload = { id, username, email };

        // 簽發JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        // 將JWT回傳給客户端
        res.json({ token });

    };

}
