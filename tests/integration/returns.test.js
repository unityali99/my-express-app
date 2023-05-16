require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../../server");
const User = require("../../models/User");
const Rental = require("../../models/Rental");
const Return = require("../../models/Returns");
const Customer = require("../../models/Customer");
const Movie = require("../../models/Movie");
const Genre = require("../../models/Genre");

const returnsEndPoint = "/api/returns";
const execPost = async (rentalId) => {
  const res = await request(server)
    .post(returnsEndPoint)
    .set("X-Auth-Token", new User().generateAuthToken())
    .send({
      rental: rentalId,
      date: new Date(),
    });
  return res;
};

describe(returnsEndPoint, () => {
  const customer = new Customer({
    name: "test1",
    isGold: false,
    phone: "12345678910",
  });
  const movie = new Movie({
    name: "test",
    price: 20,
    releaseYear: 1998,
    genre: new Genre()._id,
  });
  const rental = new Rental({
    date: new Date(),
    customer: customer._id,
    movie: movie._id,
  });

  beforeAll(async () => {
    await customer.save();
    await movie.save();
    await rental.save();
  });
  afterAll(async () => {
    await server.close();
    await Customer.deleteMany({});
    await Movie.deleteMany({});
    await Rental.deleteMany({});
    await Return.deleteMany({});
  });
  it("Should return 401 if the client is not logged in", async () => {
    const res = await request(server).post(returnsEndPoint).send({
      /*Shoud send rental id*/
    });
    expect(res.status).toBe(401);
  });
  it("Should return 422 if rental id is not provided", async () => {
    const res = await request(server)
      .post(returnsEndPoint)
      .set("X-Auth-Token", new User().generateAuthToken())
      .send({
        date: new Date(),
      });
    expect(res.status).toBe(422);
  });
  it("Should return 422 if date is not provided", async () => {
    const res = await request(server)
      .post(returnsEndPoint)
      .set("X-Auth-Token", new User().generateAuthToken())
      .send({
        rental: new Rental()._id,
      });
    expect(res.status).toBe(422);
  });
  it("Should return 404 if there is no rental related to the provided rental id", async () => {
    const res = await execPost(new Rental()._id);
    expect(res.status).toBe(404);
  });
  it("Should return 409 if the return aleardy exists", async () => {
    await Return.create({
      rental: rental._id,
      date: new Date(),
    });
    const res = await execPost(rental._id);
    expect(res.status).toBe(409);
  });
  it("Should return 200 if the return is saved successfully", async () => {
    await Return.deleteMany({});
    const res = await execPost(rental._id);
    expect(res.status).toBe(200);
  });
});
