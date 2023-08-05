import { jest } from "@jest/globals";
import { IUserRepository } from "../src/types/components";
export type MockFactory<T extends Object> = () => jest.MockedObject<T>;

export const mockUserRepository: MockFactory<IUserRepository> = () => ({
  save: jest.fn<IUserRepository['save']>(),
  getAllUsers: jest.fn<IUserRepository['getAllUsers']>(),
})
