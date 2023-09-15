import { IUserRepository } from "../app/Repository";
import { UserService } from "../app/UserService";
import type { Request, Response } from "express";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
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

        const id = await this.userService.login(username, password);
        if (!id)
            return res.status(401).json({ message: 'Wrong username or password' });

        const payload = { id, username };
        try {
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10d' });
            res.status(200).json({ message: 'Success!', token });
        } catch (err) {
            res.status(500).json({ message: 'Token generation failed' });
        }
    }

    register = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        const user = await this.userService.register(username, password, email);
        res.status(201).json(user);
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
        const { name, email } = ticket.getPayload();

        // 在資料庫中新增或更新使用者
        const user = await this.userService.register(name, null, email);

        const { id, username } = user;
        const payload = { id, username, email };

        try {
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10d' });
            res.status(200).json({ message: 'Success!', token });
        } catch (err) {
            res.status(500).json({ message: 'Token generation failed' });
        }
    };

}
