require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../../server");

const returnsEndPoint = "/api/returns";

describe(returnsEndPoint, () => {
  afterEach(async () => {
    await server.close();
  });
  it("Should return 401 if the client is not logged in", async () => {
    const res = await request(server).post(returnsEndPoint).send({
      /*Shoud send rental id*/
    });
    expect(res.status).toBe(401);
  });
});
