import { IUserRepository } from "./Repository";

export class UserService {
    public repository: IUserRepository;

    constructor(repository: IUserRepository) {
        this.repository = repository;
    }

    async findById(id: number) {
        const { username, email } = await this.repository.findById(id);
        return { id, username, email };
    }

    async login(username: string, password: string) {
        const user = await this.repository.find(username, password);
        return user ? user.id : null;
    }

    async register(username: string, password: string, email: string) {
        const usernameExist = await this.usernameAlreadyExists(username);
        if (usernameExist) throw new Error('Username already exists');

        const emailExist = await this.emailAlreadyExists(email);
        if (emailExist) throw new Error('Email already exists');

        const { id } = await this.repository.create(username, password, email);
        return { id, username, email };
    }

    private async usernameAlreadyExists(username: string) {
        const user = await this.repository.findByName(username);
        return (!!user);
    }

    private async emailAlreadyExists(email: string) {
        const user = await this.repository.findByEmail(email);
        return (!!user);
    }

}


