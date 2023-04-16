const { verify } = require("jsonwebtoken");
const User = require("../models/User");

describe("generateAuthToken", () => {
  it("Should return a valid jwt", () => {
    const user = new User({
      email: "ali@gmail.com",
      fullName: "Ali Hasani",
      password: "Ali13131313@",
      isAdmin: false,
    });
    const jwt = user.generateAuthToken();
    const decoded = verify(jwt, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({
      fullName: "Ali Hasani",
      isAdmin: false,
    });
  });
});
