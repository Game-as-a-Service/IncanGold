import { IUserRepository } from "./Repository";

export class UserService {
    public repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async login(username: string, password: string) {
        const { id } = await this.repository.find(username, password);
        return id;
    }

    async register(username: string, password: string, email: string) {
        const { id } = await this.repository.create(username, password, email);
        return { id, username, email };
    }

}


