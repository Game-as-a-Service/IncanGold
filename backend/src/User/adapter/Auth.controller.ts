import { IUserRepository } from "../app/Repository";
import { IUser } from "../app/User";
import { UserService } from "../app/UserService";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

export class AuthController {
    public repo: IUserRepository;
    public userService: UserService;

    constructor(repository: IUserRepository) {
        this.repo = repository;
        this.userService = new UserService(repository);
    }

    login = async (req, res) => {
        const { username, password } = req.body;

        const user = await this.userService.validate(username, password);
        if (!user)
            return res.status(401).send('wrong user name or password');

        const payload = { userId: user.id };
        const token = jwt.sign(payload, JWT_SECRET);
        res.json({ access_token: token });
    }
}
