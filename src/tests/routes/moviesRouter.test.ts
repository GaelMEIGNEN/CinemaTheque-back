import request, { Test } from "supertest";
import { ObjectId } from "mongodb";
import server from "../../server";

jest.mock("../../controllers/moviesController.ts", () => {
  return {
    getMovies: jest.fn().mockResolvedValue([
      {
        _id: new ObjectId("5176a34f4f8e634b6d9fb002"),
        title: "La ligne verte",
        posterPath: "/hdsqhg372Y3HJ32.png",
        releaseDate: "2021-12-05",
        overview: "A beautiful overview",
        actorsStarring: [new ObjectId("6176a34f4f8e634b6d9fb003")],
      },
      {
        _id: new ObjectId("1276a34f4f8e634b6d9fb004"),
        title: "Les évadés",
        posterPath: "/PCLMSDldslk094029032.png",
        releaseDate: "2021-12-05",
        overview: "What an overview !",
        actorsStarring: [new ObjectId("6176a34f4f8e634b6d9fb005")],
      },
    ]),
    getMovieById: jest.fn().mockResolvedValue({
      _id: new ObjectId("5176a34f4f8e634b6d9fb006"),
      title: "La ligne verte",
      posterPath: "/hdsqhg372Y3HJ32.png",
      releaseDate: "2021-12-05",
      overview: "A beautiful overview",
      actorsStarring: [new ObjectId("6176a34f4f8e634b6d9fb007")],
    }),
  };
});

describe("GET /api/movies/", () => {
  it("should return HTTP 200 and an array of movies", async () => {
    expect.assertions(3);
    const response = await request(server).get("/api/movies/").expect(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([
      {
        _id: new ObjectId("5176a34f4f8e634b6d9fb002").toString(),
        title: "La ligne verte",
        posterPath: "/hdsqhg372Y3HJ32.png",
        releaseDate: "2021-12-05",
        overview: "A beautiful overview",
        actorsStarring: [new ObjectId("6176a34f4f8e634b6d9fb003").toString()],
      },
      {
        _id: new ObjectId("1276a34f4f8e634b6d9fb004").toString(),
        title: "Les évadés",
        posterPath: "/PCLMSDldslk094029032.png",
        releaseDate: "2021-12-05",
        overview: "What an overview !",
        actorsStarring: [new ObjectId("6176a34f4f8e634b6d9fb005").toString()],
      },
    ]);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return http 200 and a movie", async () => {
    const response = await request(server).get("/api/movies/1").expect(200);
    expect(response.body).toEqual({
      _id: new ObjectId("5176a34f4f8e634b6d9fb006").toString(),
      title: "La ligne verte",
      posterPath: "/hdsqhg372Y3HJ32.png",
      releaseDate: "2021-12-05",
      overview: "A beautiful overview",
      actorsStarring: [new ObjectId("6176a34f4f8e634b6d9fb007").toString()],
    });
  });
});
