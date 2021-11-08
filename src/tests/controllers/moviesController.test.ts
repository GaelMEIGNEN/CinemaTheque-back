import actorsService, { Actor } from "../../services/actorsService";
import moviesController from "../../controllers/moviesController";
import moviesService, { Movie } from "../../services/moviesService";

jest
  .spyOn(moviesService, "getMoviesFromMongoDB")
  .mockResolvedValue([
    new Movie(
      "5176a34f4f8e634b6d9fb002",
      "test-title",
      "/JKLDSjcdbnD32190.png",
      "2021-12-12",
      "What a great overview !",
      []
    ),
    new Movie(
      "5176a34f4f8e634b6d9fb003",
      "title",
      "/PMdlsdj9402.png",
      "2021-12-12",
      "A beautiful overview",
      []
    ),
  ]);
jest
  .spyOn(moviesService, "getMoviesFromBigQuery")
  .mockResolvedValue([
    new Movie(
      "5176a34f4f8e634b6d9fb004",
      "test-title",
      "/JKLDSjcdbnD32190.png",
      "2021-12-12",
      "What a great overview !",
      []
    ),
    new Movie(
      "5176a34f4f8e634b6d9fb005",
      "title",
      "/PMdlsdj9402.png",
      "2021-12-12",
      "A beautiful overview",
      []
    ),
  ]);
jest
  .spyOn(moviesService, "getMovieByIdFromMongoDB")
  .mockResolvedValue(
    new Movie(
      "5176a34f4f8e634b6d9fb006",
      "titleMongoById",
      "/PMdlsdj9402.png",
      "2021-12-12",
      "A beautiful overview",
      [
        new Actor(
          "5176a34f4f8e634b6d9fb023",
          "Gaël",
          "Testeur pro",
          "/fklslhfjksdhkj.png",
          []
        ),
      ]
    )
  );
jest
  .spyOn(moviesService, "getMovieByIdFromBigQuery")
  .mockResolvedValue(
    new Movie(
      "5176a34f4f8e634b6d9fb007",
      "titleBQById",
      "/PMdlsdj9402.png",
      "2021-12-12",
      "A beautiful overview",
      [
        new Actor(
          "5176a34f4f8e634b6d9fb024",
          "Gaël",
          "Meign2",
          "/fklslhfjksdhkj.png",
          []
        ),
      ]
    )
  );
describe("getMovies", () => {
  it("should return a list of movies from mongoDB", async () => {
    const results = await moviesController.getMovies();

    expect(results).toHaveLength(2);
    expect(results).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        title: "test-title",
        posterPath: "/JKLDSjcdbnD32190.png",
        releaseDate: "2021-12-12",
        overview: "What a great overview !",
        actorsStarring: [],
      },
      {
        _id: "5176a34f4f8e634b6d9fb003",
        title: "title",
        posterPath: "/PMdlsdj9402.png",
        releaseDate: "2021-12-12",
        overview: "A beautiful overview",
        actorsStarring: [],
      },
    ]);
  });
  it("should return a list of movies from BigQuery if mongoDB is down", async () => {
    jest.spyOn(moviesService, "getMoviesFromMongoDB").mockResolvedValue([]);
    const results = await moviesController.getMovies();

    expect(results).toHaveLength(2);
    expect(results).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb004",
        title: "test-title",
        posterPath: "/JKLDSjcdbnD32190.png",
        releaseDate: "2021-12-12",
        overview: "What a great overview !",
        actorsStarring: [],
      },
      {
        _id: "5176a34f4f8e634b6d9fb005",
        title: "title",
        posterPath: "/PMdlsdj9402.png",
        releaseDate: "2021-12-12",
        overview: "A beautiful overview",
        actorsStarring: [],
      },
    ]);
  });
  it("should return a movie from mongoDB", async () => {
    const result = await moviesController.getMovieById("5");

    expect(result).toEqual({
      _id: "5176a34f4f8e634b6d9fb006",
      title: "titleMongoById",
      posterPath: "/PMdlsdj9402.png",
      releaseDate: "2021-12-12",
      overview: "A beautiful overview",
      actorsStarring: [
        {
          _id: "5176a34f4f8e634b6d9fb023",
          firstName: "Gaël",
          lastName: "Testeur pro",
          pictureUrl: "/fklslhfjksdhkj.png",
          starredIn: [],
        },
      ],
    });
  });
  it("should return a movie from BigQuery if mongoDB is down", async () => {
    jest
      .spyOn(moviesService, "getMovieByIdFromMongoDB")
      .mockResolvedValue(new Movie("", "", "", "", "", []));
    const result = await moviesController.getMovieById("5");

    expect(result).toEqual({
      _id: "5176a34f4f8e634b6d9fb007",
      title: "titleBQById",
      posterPath: "/PMdlsdj9402.png",
      releaseDate: "2021-12-12",
      overview: "A beautiful overview",
      actorsStarring: [
        {
          _id: "5176a34f4f8e634b6d9fb024",
          firstName: "Gaël",
          lastName: "Meign2",
          pictureUrl: "/fklslhfjksdhkj.png",
          starredIn: [],
        },
      ],
    });
  });
});
