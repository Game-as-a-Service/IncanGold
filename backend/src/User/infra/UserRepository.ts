import { AppDataSource } from "../../Shared/infra/data-source";
import { User } from "./User";
import { IUserRepository } from "../app/Repository";
import { IUser } from "../app/User";
import { DataSource } from "typeorm";

export class UserRepository implements IUserRepository {

    public dataSource: DataSource;

    constructor() {
        this.dataSource = AppDataSource;
    }

    async create(username: string, passwd: string, email: string): Promise<IUser> {
        const user = new User();
        user.username = username;
        user.passwd = passwd || null;
        user.email = email;
        await this.dataSource.getRepository(User).save(user);
        return user;
    }

    async find(username: string, passwd: string): Promise<IUser | null> {
        const user = await this.dataSource.getRepository(User).findOneBy({ username, passwd });
        return user;
    }

    async findByName(username: string): Promise<IUser | null> {
        const user = await this.dataSource.getRepository(User).findOneBy({ username });
        return user;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await this.dataSource.getRepository(User).findOneBy({ email });
        return user;
    }

    async findById(id: number): Promise<IUser | null> {
        const user = await this.dataSource.getRepository(User).findOneBy({ id });
        return user;
    }

    async save(user: IUser): Promise<void> {
        await this.dataSource.getRepository(User).save(user);
    }

    async deleteById(id: number): Promise<number> {
        const result = await this.dataSource.getRepository(User).delete({ id });
        return result.affected;
    }
}