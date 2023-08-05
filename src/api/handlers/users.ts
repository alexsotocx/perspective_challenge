import { IUserGetParams, IUserRepository } from "../../types/components";
import { IUser } from "../../types/models";
import { IUserCreatePayload } from "../dto/requests/user-create";
import { randomUUID } from "crypto";
import { UserAlreadyExistException } from "../../exceptions";
import { IGetAllUserPayload } from "../dto/requests/get-all-users";
import { IGetAllUsersResponse } from "../dto/responses/get-all-users";

export class UserHandler {
  constructor(private readonly repository: IUserRepository) {
  }

  async saveUser(payload: IUserCreatePayload): Promise<IUser> {

    const res = await this.repository.getAllUsersPaginated({
      email: [payload.email]
    });

    if (res.totalItems > 0) throw new UserAlreadyExistException(payload.email);

    return this.repository.save({
      email: payload.email,
      created_at: new Date().toISOString(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      id: randomUUID()
    });
  }


  async getAllUsers(payload: IGetAllUserPayload): Promise<IGetAllUsersResponse> {
    const order: IUserGetParams["orderBy"] = [];

    if (payload.created) {
      order.push({ key: "created_at", direction: "ASC" });
    } else {
      order.push({ key: "lastName", direction: "ASC" });
    }

    const res = await this.repository.getAllUsersPaginated({
      pagination: payload.pagination,
      orderBy: order
    });

    return {
      users: res.users,
      page: payload.pagination.page,
      limit: payload.pagination.limit,
      totalPages: res.pages,
      totalItems: res.totalItems
    };
  }
}
