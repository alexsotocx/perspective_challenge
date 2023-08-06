import { jest } from "@jest/globals";
import { IUserRepository } from "../src/types/components";

// eslint-disable-next-line
export type MockFactory<T extends Object> = () => jest.MockedObject<T>;

export const mockUserRepository: MockFactory<IUserRepository> = () => ({
  save: jest.fn<IUserRepository['save']>(),
  getAllUsersPaginated: jest.fn<IUserRepository['getAllUsersPaginated']>(),
})
