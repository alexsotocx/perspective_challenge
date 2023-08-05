import { IUserGetParams, IUserRepository } from "../types/components";
import { IUser } from "../types/models";

export class MongoUsersRepository implements IUserRepository {
  getAllUsersPaginated(options?: IUserGetParams): Promise<{ users: IUser[]; totalItems: number; pages: number }> {
    return Promise.resolve({ pages: 0, totalItems: 0, users: [] });
  }

  save(user: IUser): Promise<IUser> {
    return Promise.resolve(undefined);
  }
}
