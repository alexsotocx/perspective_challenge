import { IUser } from "./models";

export interface IUserGetParams {
  email?: string[];
  id?: string[];
  order_by?: {key: keyof IUser, direction: 'ASC' | 'DESC'}[],
  pagination?: { limit: number, page: number};
}

export interface IUserRepository {
  save(user: IUser): Promise<IUser>;
  getAllUsers(options?: IUserGetParams): Promise<IUser[]>;
}
