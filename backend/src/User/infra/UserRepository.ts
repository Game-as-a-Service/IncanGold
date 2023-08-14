import { AppDataSource } from "../../Shared_infra/data-source";
import { User } from "./User";
import { IUserRepository } from "../app/Repository";
import { IUser } from "../app/User";
import { DataSource } from "typeorm";

export class UserRepository implements IUserRepository {

    public dataSource:DataSource;

    constructor(){
        this.dataSource = AppDataSource;
    }

    create(username: string):IUser{
        const user = new User();
        return user;
    }

    async find(username:string,passwd:string):Promise<IUser|undefined>{
        const user = await this.dataSource.getRepository(User).findOneBy({username,passwd});
        return user;
    }
    
    async save(user:IUser): Promise<void>{
        await this.dataSource.getRepository(User).save(user);
    }
}