import { IUserGetParams, IUserRepository } from "../../types/components";
import { IUser } from "../../types/models";
import { IUserCreatePayload, userCreatePayload } from "../dto/requests/user-create";
import { randomUUID } from "crypto";
import { validatePayload } from "../../util/vaidation";
import { UserAlreadyExistException } from "../../exceptions";
import { getAllUsersSchema, IGetAllUserPayload } from "../dto/requests/get-all-users";

export class UserHandler {
  constructor(private readonly repository: IUserRepository) {
  }

  async saveUser(dirtyPayload: IUserCreatePayload): Promise<IUser> {
    const validPayload = await validatePayload(dirtyPayload, userCreatePayload);

    const [existingUser] = await this.repository.getAllUsers({
      email: [validPayload.email]
    });

    if (existingUser) throw new UserAlreadyExistException(validPayload.email);

    return this.repository.save({
      email: validPayload.email,
      created_at: new Date().toISOString(),
      firstName: validPayload.firstName,
      lastName: validPayload.lastName,
      id: randomUUID()
    });
  }


  async getAllUsers(param: IGetAllUserPayload) {
    const defaultPayload = await validatePayload(param, getAllUsersSchema);

    const order: IUserGetParams["order_by"] = [];

    if (param.created) {
      order.push({ key: "created_at", direction: "ASC" });
    } else {
      order.push({ key: "lastName", direction: "ASC" });
    }

    return this.repository.getAllUsers({
      pagination: defaultPayload.pagination,
      order_by: order
    });
  }
}
