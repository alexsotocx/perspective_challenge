import { IUserRepository } from "../../types/components";
import { IUser } from "../../types/models";
import { IUserCreatePayload } from "../dto/requests/user-create";
import { randomUUID } from "crypto";

export class UserHandler {
  constructor(private readonly repository: IUserRepository) {
  }

  async saveUser(dirtyPayload: IUserCreatePayload): Promise<IUser> {
    return this.repository.save({
      email: dirtyPayload.email,
      created_at: new Date().toISOString(),
      firstName: dirtyPayload.firstName,
      lastName: dirtyPayload.lastName,
      id: randomUUID(),
    })
  }
}
