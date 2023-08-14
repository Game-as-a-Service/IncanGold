import { IUser } from "./User";

export interface IUserRepository {
    create(username: string):IUser;

    find(username:string,passwd:string):Promise<IUser|undefined>;
    
    save(user:IUser): Promise<void>;
}
