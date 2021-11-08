import { ObjectId } from "bson";
import { actorsService } from "../../services/actorsService";
import moviesService from "../../services/moviesService";

jest
  .spyOn(actorsService, "getActorsMinimalInformationsByArrayIdFromMongoDB")
  .mockResolvedValue([
    {
      _id: "5176a34f4f8e634b6d9fb015",
      firstName: "Gaël",
      lastName: "Meignen",
      pictureUrl: "/PCODOVKJjdskq93209402.jpg",
      starredIn: [],
    },
  ]);
jest.mock("mongodb", () => {
  return {
    ObjectId: jest.fn().mockReturnValue({}),
    MongoClient: jest.fn().mockReturnValue({
      connect: jest.fn().mockReturnValue({}),
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn().mockReturnValue({
            _id: "5176a34f4f8e634b6d9fb014",
            title: "La ligne verte",
            posterPath: "/hdsqhg372Y3HJ32.png",
            releaseDate: "2021-12-12",
            overview: "A beautiful overview",
            actorsStarring: [
              {
                _id: "5176a34f4f8e634b6d9fb015",
              },
            ],
          }),
          find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockReturnValue([
              {
                _id: "5176a34f4f8e634b6d9fb002",
                title: "La ligne verte",
                posterPath: "/hdsqhg372Y3HJ32.png",
                releaseDate: "2021-12-12",
                overview: "A beautiful overview",
                actorsStarring: [
                  {
                    _id: "5176a34f4f8e634b6d9fb003",
                    firstName: "Gaël",
                    lastName: "Meignen",
                    pictureUrl: "/PCODOVKJjdskq93209402.jpg",
                    starredIn: [],
                  },
                ],
              },
              {
                _id: "5176a34f4f8e634b6d9fb012",
                title: "Les évadés",
                posterPath: "/PCLMSDldslk094029032.png",
                releaseDate: "2021-12-12",
                overview: "What an overview !",
                actorsStarring: [
                  {
                    _id: "5176a34f4f8e634b6d9fb013",
                    firstName: "PasGaël",
                    lastName: "PasMeignen",
                    pictureUrl: "/pcsLdksIj819Jksjd12.jpg",
                    starredIn: [],
                  },
                ],
              },
            ]),
          }),
        }),
      }),
    }),
  };
});

jest.mock("@google-cloud/bigquery", () => {
  return {
    BigQuery: jest.fn().mockReturnValue({
      createQueryJob: jest.fn().mockImplementation(() => {
        switch (getQueryResultsValue) {
          case "getMoviesFromBigQuery":
            return [
              {
                getQueryResults: jest.fn().mockResolvedValue([
                  [
                    {
                      _id: "5176a34f4f8e634b6d9fb002",
                      title: "La ligne verte",
                      posterPath: "/hdsqhg372Y3HJ32.png",
                      releaseDate: "2021-12-12",
                      overview: "A beautiful overview",
                      actorsStarring: [
                        {
                          _id: "5176a34f4f8e634b6d9fb003",
                          firstName: "Gaël",
                          lastName: "Meignen",
                          pictureUrl: "/PCODOVKJjdskq93209402.jpg",
                          starredIn: [],
                        },
                      ],
                    },
                    {
                      _id: "5176a34f4f8e634b6d9fb012",
                      title: "Les évadés",
                      posterPath: "/PCLMSDldslk094029032.png",
                      releaseDate: "2021-12-12",
                      overview: "What an overview !",
                      actorsStarring: [
                        {
                          _id: "5176a34f4f8e634b6d9fb013",
                          firstName: "PasGaël",
                          lastName: "PasMeignen",
                          pictureUrl: "/pcsLdksIj819Jksjd12.jpg",
                          starredIn: [],
                        },
                      ],
                    },
                  ],
                ]),
              },
            ];

          case "getMoviesMinimalInformationsByArrayIdFromBigQuery":
            return [
              {
                getQueryResults: jest.fn().mockResolvedValue([
                  [
                    {
                      _id: "5176a34f4f8e634b6d9fb002",
                      title: "La ligne verte",
                      posterPath: "/hdsqhg372Y3HJ32.png",
                    },
                    {
                      _id: "5176a34f4f8e634b6d9fb012",
                      title: "Les évadés",
                      posterPath: "/PCLMSDldslk094029032.png",
                    },
                  ],
                ]),
              },
            ];
          case "getMovieByIdFromBigQuery":
            return [
              {
                getQueryResults: jest.fn().mockResolvedValue([
                  [
                    {
                      _id: "5176a34f4f8e634b6d9fb016",
                      title: "La ligne verte",
                      posterPath: "/hdsqhg372Y3HJ32.png",
                      releaseDate: "2021-12-12",
                      overview: "A beautiful overview",
                      actorsStarring: [
                        {
                          _id: "5176a34f4f8e634b6d9fb017",
                          firstName: "Gaël",
                          lastName: "Meign2",
                          pictureUrl: "/PCODOVKJjdskq93209402.jpg",
                          starredIn: [],
                        },
                        {
                          _id: "5176a34f4f8e634b6d9fb018",
                          firstName: "Gaël",
                          lastName: "Meign2",
                          pictureUrl: "/PCODOVKJjdskq93209402.jpg",
                          starredIn: [],
                        },
                      ],
                    },
                  ],
                ]),
              },
            ];
          default:
            return [
              {
                getQueryResults: jest.fn().mockResolvedValue([[{}]]),
              },
            ];
        }
      }),
    }),
  };
});

var getQueryResultsValue: string = "";
describe("movies MongoDB", () => {
  it("should return an array of movies", async () => {
    expect(await moviesService.getMoviesFromMongoDB()).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        title: "La ligne verte",
        posterPath: "/hdsqhg372Y3HJ32.png",
        releaseDate: "2021-12-12",
        overview: "A beautiful overview",
        actorsStarring: [
          {
            _id: "5176a34f4f8e634b6d9fb003",
            firstName: "Gaël",
            lastName: "Meignen",
            pictureUrl: "/PCODOVKJjdskq93209402.jpg",
            starredIn: [],
          },
        ],
      },
      {
        _id: "5176a34f4f8e634b6d9fb012",
        title: "Les évadés",
        posterPath: "/PCLMSDldslk094029032.png",
        releaseDate: "2021-12-12",
        overview: "What an overview !",
        actorsStarring: [
          {
            _id: "5176a34f4f8e634b6d9fb013",
            firstName: "PasGaël",
            lastName: "PasMeignen",
            pictureUrl: "/pcsLdksIj819Jksjd12.jpg",
            starredIn: [],
          },
        ],
      },
    ]);
  });

  it("should return a movie with an actor list containing 1 actor", async () => {
    expect(
      await moviesService.getMovieByIdFromMongoDB("5176a34f4f8e634b6d9fb014")
    ).toEqual({
      _id: "5176a34f4f8e634b6d9fb014",
      title: "La ligne verte",
      posterPath: "/hdsqhg372Y3HJ32.png",
      releaseDate: "2021-12-12",
      overview: "A beautiful overview",
      actorsStarring: [
        {
          _id: "5176a34f4f8e634b6d9fb015",
          firstName: "Gaël",
          lastName: "Meignen",
          pictureUrl: "/PCODOVKJjdskq93209402.jpg",
          starredIn: [],
        },
      ],
    });
  });

  it("should return an array of movies with all of the searched ids", async () => {
    expect(
      await moviesService.getMoviesMinimalInformationsByArrayIdFromMongoDB([
        { _id: "5176a34f4f8e634b6d9fb002" },
        { _id: "5176a34f4f8e634b6d9fb012" },
      ])
    ).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        title: "La ligne verte",
        posterPath: "/hdsqhg372Y3HJ32.png",
        releaseDate: "2021-12-12",
        overview: "A beautiful overview",
        actorsStarring: [
          {
            _id: "5176a34f4f8e634b6d9fb003",
            firstName: "Gaël",
            lastName: "Meignen",
            pictureUrl: "/PCODOVKJjdskq93209402.jpg",
            starredIn: [],
          },
        ],
      },
      {
        _id: "5176a34f4f8e634b6d9fb012",
        title: "Les évadés",
        posterPath: "/PCLMSDldslk094029032.png",
        releaseDate: "2021-12-12",
        overview: "What an overview !",
        actorsStarring: [
          {
            _id: "5176a34f4f8e634b6d9fb013",
            firstName: "PasGaël",
            lastName: "PasMeignen",
            pictureUrl: "/pcsLdksIj819Jksjd12.jpg",
            starredIn: [],
          },
        ],
      },
    ]);
  });
});
describe("movies BigQuery", () => {
  it("should return an array of movies", async () => {
    getQueryResultsValue = "getMoviesFromBigQuery";
    expect(await moviesService.getMoviesFromBigQuery()).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        title: "La ligne verte",
        posterPath: "/hdsqhg372Y3HJ32.png",
        releaseDate: "2021-12-12",
        overview: "A beautiful overview",
        actorsStarring: [
          {
            _id: "5176a34f4f8e634b6d9fb003",
            firstName: "Gaël",
            lastName: "Meignen",
            pictureUrl: "/PCODOVKJjdskq93209402.jpg",
            starredIn: [],
          },
        ],
      },
      {
        _id: "5176a34f4f8e634b6d9fb012",
        title: "Les évadés",
        posterPath: "/PCLMSDldslk094029032.png",
        releaseDate: "2021-12-12",
        overview: "What an overview !",
        actorsStarring: [
          {
            _id: "5176a34f4f8e634b6d9fb013",
            firstName: "PasGaël",
            lastName: "PasMeignen",
            pictureUrl: "/pcsLdksIj819Jksjd12.jpg",
            starredIn: [],
          },
        ],
      },
    ]);
  });
  //TODO : Harmonize id between bq/mongoDB
  it("should return an array of movies with all of the searched ids", async () => {
    getQueryResultsValue = "getMoviesMinimalInformationsByArrayIdFromBigQuery";
    expect(
      await moviesService.getMoviesMinimalInformationsByArrayIdFromBigQuery([
        "5176a34f4f8e634b6d9fb002",
        "5176a34f4f8e634b6d9fb012",
      ])
    ).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        title: "La ligne verte",
        posterPath: "/hdsqhg372Y3HJ32.png",
      },
      {
        _id: "5176a34f4f8e634b6d9fb012",
        title: "Les évadés",
        posterPath: "/PCLMSDldslk094029032.png",
      },
    ]);
  });

  it("should return a movie with an actor list containing 2 actors", async () => {
    getQueryResultsValue = "getMovieByIdFromBigQuery";
    expect(await moviesService.getMovieByIdFromBigQuery(5)).toEqual({
      _id: "5176a34f4f8e634b6d9fb016",
      title: "La ligne verte",
      posterPath: "/hdsqhg372Y3HJ32.png",
      releaseDate: "2021-12-12",
      overview: "A beautiful overview",
      actorsStarring: [
        {
          _id: "5176a34f4f8e634b6d9fb017",
          firstName: "Gaël",
          lastName: "Meign2",
          pictureUrl: "/PCODOVKJjdskq93209402.jpg",
          starredIn: [],
        },
        {
          _id: "5176a34f4f8e634b6d9fb018",
          firstName: "Gaël",
          lastName: "Meign2",
          pictureUrl: "/PCODOVKJjdskq93209402.jpg",
          starredIn: [],
        },
      ],
    });
  });
});
