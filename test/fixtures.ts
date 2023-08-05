import { IUser } from "../src/types/models";
import { randomUUID } from "crypto";

export const userFixture: IUser = {
  lastName: "lastName",
  id: randomUUID(),
  firstName: "firstName",
  email: "email@email.com",
  created_at: new Date().toISOString()
};

export const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
