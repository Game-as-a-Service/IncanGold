import { IUser } from "./User";

export interface IUserRepository {
    create(username: string, passwd: string, email: string):Promise<IUser>;

    find(username:string,passwd:string):Promise<IUser|undefined>;
    
    save(user:IUser): Promise<void>;
}
