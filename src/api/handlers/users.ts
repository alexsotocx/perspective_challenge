import { IUserGetParams, IUserRepository } from "../../types/components";
import { IUser } from "../../types/models";
import { IUserCreatePayload, userCreatePayload } from "../dto/requests/user-create";
import { randomUUID } from "crypto";
import { validatePayload } from "../../util/vaidation";
import { UserAlreadyExistException } from "../../exceptions";
import { getAllUsersSchema, IGetAllUserPayload } from "../dto/requests/get-all-users";
import { IGetAllUsersResponse } from "../dto/responses/get-all-users";

export class UserHandler {
  constructor(private readonly repository: IUserRepository) {
  }

  async saveUser(dirtyPayload: IUserCreatePayload): Promise<IUser> {
    const validPayload = await validatePayload(dirtyPayload, userCreatePayload);

    const res = await this.repository.getAllUsersPaginated({
      email: [validPayload.email]
    });

    if (res.totalItems > 0) throw new UserAlreadyExistException(validPayload.email);

    return this.repository.save({
      email: validPayload.email,
      created_at: new Date().toISOString(),
      firstName: validPayload.firstName,
      lastName: validPayload.lastName,
      id: randomUUID()
    });
  }


  async getAllUsers(param: IGetAllUserPayload): Promise<IGetAllUsersResponse> {
    const defaultPayload = await validatePayload(param, getAllUsersSchema);

    const order: IUserGetParams["orderBy"] = [];

    if (param.created) {
      order.push({ key: "created_at", direction: "ASC" });
    } else {
      order.push({ key: "lastName", direction: "ASC" });
    }

    const res = await this.repository.getAllUsersPaginated({
      pagination: defaultPayload.pagination,
      orderBy: order
    });

    return {
      users: res.users,
      page: defaultPayload.pagination.page,
      limit: defaultPayload.pagination.limit,
      totalPages: res.pages,
      totalItems: res.totalItems
    };
  }
}
