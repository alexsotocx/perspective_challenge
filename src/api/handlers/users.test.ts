import { UserHandler } from "./users";
import { mockUserRepository } from "../../../test/mocks";
import { userFixture, uuidRegex } from "../../../test/fixtures";
import { UserAlreadyExistException, ValidationError } from "../../exceptions";



describe("UserHandler", () => {
  const mockRepo = mockUserRepository();

  const handler = new UserHandler(mockRepo);

  beforeEach(() => jest.resetAllMocks());

  describe("saveUser", () => {
    test("saves the user in the repository", async () => {
      mockRepo.save.mockResolvedValue(userFixture);
      mockRepo.getAllUsers.mockResolvedValue([]);

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

    describe("with a wrong validation", () => {
      test("does not save the user", async () => {
        await expect(handler.saveUser({
          lastName: "",
          firstName: 123,
          email: "not an valid email",
          other: true
        } as never)).rejects.toThrow(ValidationError);

        expect(mockRepo.save).not.toBeCalled();
      });
    });

    describe("when user already exists", () => {
      test("does not save the user", async () => {
        mockRepo.getAllUsers.mockResolvedValue([userFixture]);

        await expect(handler.saveUser({
          lastName: userFixture.lastName,
          firstName: userFixture.firstName,
          email: userFixture.email
        })).rejects.toThrow(UserAlreadyExistException);

        expect(mockRepo.save).not.toBeCalled();
      });
    });
  });
});
