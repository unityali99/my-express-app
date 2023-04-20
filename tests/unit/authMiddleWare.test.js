const User = require("../../models/User");
const { auth } = require("../../utilities/middlewares");
require("dotenv").config({ path: ".env.test" });

const next = jest.fn();
const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

describe("auth middleware", () => {
  it("Shoud response with code 401 if no auth token provided", async () => {
    const req = { header: jest.fn() };
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(req?.user).toBeFalsy();
  });
  it("Shoud response with code 422 if invalid auth token provided", async () => {
    // INVALID JWT TOKEN BELOW
    const req = {
      header: jest
        .fn()
        .mockReturnValue(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        ),
    };
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(req.user).toBeFalsy();
  });
  it("Shoud response with code 200 if valid token is provided", async () => {
    const req = {
      header: jest.fn().mockReturnValue(
        new User({
          fullName: "James bond",
          email: "007@gmail.com",
          isAdmin: false,
          password: "JamesBond007",
        }).generateAuthToken()
      ),
    };
    auth(req, res, next);
    expect(req.user).toMatchObject({ fullName: "James bond", isAdmin: false });
  });
});
