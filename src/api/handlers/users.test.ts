import { UserHandler } from "./users";
import { mockUserRepository } from "../../../test/mocks";
import { userFixture, uuidRegex } from "../../../test/fixtures";
import { UserAlreadyExistException, ValidationError } from "../../exceptions";
import { IUserGetParams } from "../../types/components";


describe("UserHandler", () => {
  const mockRepo = mockUserRepository();

  const handler = new UserHandler(mockRepo);

  beforeEach(() => jest.resetAllMocks());

  describe("saveUser", () => {
    test("saves the user in the repository", async () => {
      mockRepo.save.mockResolvedValue(userFixture);
      mockRepo.getAllUsersPaginated.mockResolvedValue({ users: [], totalItems: 0, pages: 0 });

      await handler.saveUser({
        lastName: userFixture.lastName,
        firstName: userFixture.firstName,
        email: userFixture.email
      });

      expect(mockRepo.save).toBeCalledWith({
        lastName: userFixture.lastName,
        firstName: userFixture.firstName,
        email: userFixture.email,
        id: expect.stringMatching(uuidRegex),
        created_at: expect.anything()
      });
    });

    describe("when user already exists", () => {
      test("does not save the user", async () => {
        mockRepo.getAllUsersPaginated.mockResolvedValue(
          { users: [userFixture], totalItems: 1, pages: 1 }
        );

        await expect(handler.saveUser({
          lastName: userFixture.lastName,
          firstName: userFixture.firstName,
          email: userFixture.email
        })).rejects.toThrow(UserAlreadyExistException);

        expect(mockRepo.save).not.toBeCalled();
      });
    });
  });

  describe("getAllUsers", () => {
    test("returns all the user in the db paginated", async () => {
      mockRepo.getAllUsersPaginated.mockResolvedValue({
        users: [userFixture],
        totalItems: 1,
        pages: 1
      });

      expect(await handler.getAllUsers({ pagination: { limit: 10, page: 1 } })).toEqual({
        users: [userFixture],
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 1
      });

      expect(mockRepo.getAllUsersPaginated).toBeCalledWith(<IUserGetParams>{
        orderBy: [{ direction: "ASC", key: "lastName" }],
        pagination: { limit: 10, page: 1 }
      });
    });

    describe("when created flag is passed", () => {
      test("reorders the output with created at", async () => {
        mockRepo.getAllUsersPaginated.mockResolvedValue({
          users: [userFixture],
          totalItems: 1,
          pages: 1
        });

        expect(await handler.getAllUsers({
          created: true,
          pagination: { limit: 10, page: 1 }
        })).toEqual({
          users: [userFixture],
          page: 1,
          limit: 10,
          totalPages: 1,
          totalItems: 1
        });

        expect(mockRepo.getAllUsersPaginated).toBeCalledWith(<IUserGetParams>{
          orderBy: [{ direction: "ASC", key: "created_at" }],
          pagination: { limit: 10, page: 1 }
        });
      });
    });
  });
});
