import { IUserRepository } from "../app/Repository";
import { UserService } from "../app/UserService";
import type { Request, Response } from "express";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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

    userInformation = async (req: Request, res: Response) => {
        const { id } = (req as any).user;
        const user = await this.userService.findById(Number(id));
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    }

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const id = await this.userService.login(username, password);
        if (!id)
            return res.status(401).json({ message: 'Wrong username or password' });

        try {
            const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '10d' });
            return  res.status(200).json({ message: 'Success!', token });
        } catch (err) {
            console.log('auth controller 40 : ', err)
            return res.status(500).json({ message: 'Token generation failed' });
        }
    }

    register = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        console.log(req.body);
        console.log(username, password, email);
        if (!username || !password || !email)
            return res.status(400).json({ message: 'Missing required fields' });
        try {
            const user = await this.userService.register(username, password, email);
            res.status(201).json(user);
        } catch (err) {
            res.json({ message: err.message });
        }
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
