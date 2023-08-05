import { describe, test, expect } from "@jest/globals";
import { UserHandler } from "./users";
import { mockUserRepository } from "../../../test/mocks";
import { userFixture, uuidRegex } from "../../../test/fixtures";


describe("UserHandler", () => {
  const mockRepo = mockUserRepository();

  const handler = new UserHandler(mockRepo);

  describe("saveUser", () => {
    test("saves the user in the repository", async () => {
      mockRepo.save.mockResolvedValue(userFixture);
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
        created_at: expect.anything(),
      })
    });

    describe("with a wrong validation", () => {
      test("does not save the user", () => {

      });
    });

    describe("when user already exists", () => {
      test("updates the user", () => {
      });
    });
  });
});
