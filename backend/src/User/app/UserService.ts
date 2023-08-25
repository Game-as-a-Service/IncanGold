import { IUserRepository } from "./Repository";

export class UserService {
    public repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async validate(username: string, password: string) {
        const user = await this.repository.find(username, password);
        return user;
    }

    async create(username: string, password: string, email: string) {
        return await this.repository.create(username, password, email);
    }

    async save(username: string, password: string, email: string){
        return await this.repository.find(username, password);
    }
}


