require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const server = require("../../server");
const Genre = require("../../models/Genre");
const User = require("../../models/User");

const genreEndpoint = "/api/genres";

let name;

const exec = async () => {
  return await request(server)
    .post(genreEndpoint)
    .set("X-Auth-Token", new User().generateAuthToken())
    .send({ name });
};

describe(genreEndpoint, () => {
  afterAll(() => {
    server.close();
  });
  describe("GET /", () => {
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
    it("Should send response with 500 code if valid id is passed but no genre found", async () => {
      const res = await request(server).get(
        genreEndpoint + "/" + "61717b08a7a2d0c75879e559"
      );
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    beforeEach(() => {
      name = "genre1";
    });
    it("Shoud response with code 400 if genre length is less than 4", async () => {
      name = "act";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("Shoud response with code 400 if genre length is more than 15", async () => {
      name = new Array(17).join("-");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return the genre if it's saved successfully", async () => {
      const res = await exec();
      const savedGenre = await Genre.findOne({ name });
      expect(savedGenre).toHaveProperty("_id");
      expect(savedGenre).toHaveProperty("name", "genre1");
      await Genre.deleteMany({ name });
    });
  });
});
