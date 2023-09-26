import { IUser } from "./User";

export interface IUserRepository {
    create(username: string, passwd: string, email: string): Promise<IUser>;

    find(username: string, passwd: string): Promise<IUser | null>;

    findByName(username: string): Promise<IUser | null>;

    findByEmail(email: string): Promise<IUser | null>;

    findById(id: number): Promise<IUser | null>;

    save(user: IUser): Promise<void>;

    deleteById(id: number): Promise<number>;
}