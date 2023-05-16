require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../../server");
const Genre = require("../../models/Genre");
const User = require("../../models/User");

const genreEndpoint = "/api/genres";

let name;
let id;
const testTokenUser = {
  fullName: "John Doe",
  email: "test@test.com",
  isAdmin: true,
  password: "Test1234",
};

const execPost = async () => {
  return await request(server)
    .post(genreEndpoint)
    .set("X-Auth-Token", new User().generateAuthToken())
    .send({ name });
};

const execPut = async () => {
  return await request(server)
    .put(genreEndpoint + "/" + id)
    .set("X-Auth-Token", new User(testTokenUser).generateAuthToken())
    .send({ name });
};

const execDelete = async () => {
  return await request(server)
    .delete(genreEndpoint + "/" + id)
    .set("X-Auth-Token", new User(testTokenUser).generateAuthToken())
    .send();
};

describe(genreEndpoint, () => {
  beforeAll(async () => {
    await Genre.deleteMany({
      name: { $in: ["horror", "drama", "thriller", "genre0", "genre1"] },
    });
  });
  describe("GET /", () => {
    afterEach(async () => {
      await server.close();
    });
    it("Should return an array of genre objects", async () => {
      await Genre.insertMany([
        {
          name: "horror",
        },
        { name: "drama" },
      ]);
      const res = await request(server).get(genreEndpoint);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      await Genre.deleteMany({
        name: { $in: ["horror", "drama", "thriller"] },
      });
    });
  });
  describe("GET /:id", () => {
    afterEach(async () => {
      await server.close();
    });
    it("Should return the object if valid id is passed", async () => {
      const genre = await Genre.create({ name: "thriller" });
      const res = await request(server).get(genreEndpoint + "/" + genre._id);
      expect(res.body).toMatchObject({ name: genre.name });
      await Genre.deleteMany(genre);
    });
    it("Should send response with 422 code if invalid id is passed", async () => {
      const res = await request(server).get(genreEndpoint + "/" + "1234");
      expect(res.status).toBe(422);
    });
    it("Should send response with 404 code if valid id is passed but no genre found", async () => {
      const res = await request(server).get(
        genreEndpoint + "/" + process.env.NOT_EXIST_VALID_GENRE_ID
      );
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    afterEach(async () => {
      await server.close();
    });
    beforeEach(() => {
      name = "genre1";
    });
    it("Shoud response with code 400 if genre length is less than 4", async () => {
      name = "act";
      const res = await execPost();
      expect(res.status).toBe(400);
    });
    it("Shoud response with code 400 if genre length is more than 15", async () => {
      name = new Array(17).join("-");
      const res = await execPost();
      expect(res.status).toBe(400);
    });
    it("should return the genre if it's saved successfully", async () => {
      const res = await execPost();
      const savedGenre = await Genre.findOne({ name });
      expect(savedGenre).toHaveProperty("_id");
      expect(savedGenre).toHaveProperty("name", "genre1");
      await Genre.deleteMany({ name });
    });
  });
  describe("PUT /", () => {
    afterEach(async () => {
      await server.close();
    });
    beforeEach(async () => {
      name = "genre1";
      const genre = await Genre.create({ name: "genre0" });
      id = genre._id;
    });
    afterAll(async () => {
      await Genre.deleteMany({ name: "genre0" });
    });
    it("Shoud response with code 400 if genre length is less than 4", async () => {
      name = "act";
      const res = await execPut();
      expect(res.status).toBe(400);
    });
    it("Shoud response with code 400 if genre length is more than 15", async () => {
      name = new Array(17).join("-");
      const res = await execPut();
      expect(res.status).toBe(400);
    });
    it("should return the genre if it's saved successfully", async () => {
      const res = await execPut();
      expect(res.status).toBe(200);
    });
    it("Should send response with 404 code if valid id is passed but no genre found", async () => {
      id = process.env.NOT_EXIST_VALID_GENRE_ID;
      const res = await execPut();
      expect(res.status).toBe(404);
    });
  });
  describe("DELETE /", () => {
    afterEach(async () => {
      await server.close();
    });
    it("Should send response with 404 code if valid id is passed but no genre found", async () => {
      id = process.env.NOT_EXIST_VALID_GENRE_ID;
      const res = await execDelete();
      expect(res.status).toBe(404);
    });
    it("Should send response with 200 code if the genre is deleted successfully", async () => {
      const genre = await Genre.create({ name: "genre0" });
      id = genre._id;
      const res = await execDelete();
      expect(res.status).toBe(200);
    });
  });
});
