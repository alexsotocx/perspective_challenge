import { IUser } from './models';

export interface IUserGetParams {
    email?: string[];
    id?: string[];
    orderBy?: { key: keyof IUser; direction: 'asc' | 'desc' }[];
    pagination?: { limit: number; page: number };
}

export interface IUserRepository {
    save(user: IUser): Promise<IUser>;
    getAllUsersPaginated(options?: IUserGetParams): Promise<{ users: IUser[]; totalItems: number; pages: number }>;
}
