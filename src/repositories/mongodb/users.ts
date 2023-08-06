import { IUserGetParams, IUserRepository } from "../../types/components";
import { IUser } from "../../types/models";
import { FilterQuery, Model, Mongoose } from "mongoose";
import { userSchema } from "./schemas/users";

export class MongoUsersRepository implements IUserRepository {
  private userModel: Model<IUser>;

  constructor(private readonly mongo: Mongoose, private readonly collection: string) {
    this.userModel = mongo.connection.model("User", userSchema, collection) as Model<IUser>;
  }

  async getAllUsersPaginated(options?: IUserGetParams): Promise<{ users: IUser[]; totalItems: number; pages: number }> {
    const query: FilterQuery<IUser> = {};
    if (options.id) query.id = { $in: options.id };
    if (options.email) query.email = { $in: options.email };

    const total = await this.userModel.count(query);
    const userQuery = this.userModel.find(query).limit(options.pagination.limit).skip((options.pagination.page - 1) * options.pagination.limit);

    if (options.orderBy) {
      options.orderBy.forEach(o => userQuery.sort([[o.key, o.direction]]));
    }
    const users = await userQuery;
    const totalPages = Math.ceil(total / options.pagination.limit);

    return {
      pages: totalPages,
      totalItems: total,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        createdAt: u.createdAt
      }))
    };
  }

  async save(user: IUser): Promise<IUser> {
    await this.userModel.create(user);
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userModel.find({});
  }
}
