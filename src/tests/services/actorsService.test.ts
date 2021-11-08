import { ObjectId } from "bson";
import actorsService from "../../services/actorsService";
import moviesService from "../../services/moviesService";

jest
  .spyOn(moviesService, "getMoviesMinimalInformationsByArrayIdFromMongoDB")
  .mockResolvedValue([
    {
      _id: "5176a34f4f8e634b6d9fb014",
      title: "La ligne verte",
      posterPath: "/hdsqhg372Y3HJ32.png",
      releaseDate: "",
      overview: "",
      actorsStarring: [],
    },
    {
      _id: "5176a34f4f8e634b6d9fb022",
      title: "La ligne",
      posterPath: "/hdsqhg372Y3HkdslkqPm.png",
      releaseDate: "",
      overview: "",
      actorsStarring: [],
    },
  ]);

jest
  .spyOn(moviesService, "getMoviesMinimalInformationsByArrayIdFromBigQuery")
  .mockResolvedValue([
    {
      _id: "5176a34f4f8e634b6d9fb014",
      title: "La ligne verte",
      posterPath: "/hdsqhg372Y3HJ32.png",
      releaseDate: "2021-12-12",
      overview: "A beautiful overview",
      actorsStarring: [],
    },
    {
      _id: "5176a34f4f8e634b6d9fb022",
      title: "La ligne",
      posterPath: "/hdsqhg372Y3HkdslkqPm.png",
      releaseDate: "2021-12-15",
      overview: "A b c overview",
      actorsStarring: [],
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
            firstName: "Gaël",
            lastName: "Meignen",
            pictureUrl: "/ldsqkldsqkl04920.png",
            starredIn: [],
          }),
          find: jest.fn().mockImplementation((id) => {
            // data for test : should return an array of actors
            if (id == undefined) {
              return {
                toArray: jest.fn().mockResolvedValue([
                  {
                    _id: "5176a34f4f8e634b6d9fb002",
                    firstName: "Gaël",
                    lastName: "Meignen",
                    pictureUrl: "/hdsqhg372Y3HJ32.png",
                    starredIn: [
                      {
                        _id: "5176a34f4f8e634b6d9fb014",
                        title: "La ligne verte",
                        posterPath: "/hdsqhg372Y3HJ32.png",
                        releaseDate: "2021-12-12",
                        overview: "A beautiful overview",
                        actorsStarring: [],
                      },
                    ],
                  },
                  {
                    _id: "5176a34f4f8e634b6d9fb003",
                    firstName: "Gaël2",
                    lastName: "Meign2",
                    pictureUrl: "/hdsqhg372Y3HJ35.png",
                    starredIn: [
                      {
                        _id: "5176a34f4f8e634b6d9fb022",
                        title: "La ligne",
                        posterPath: "/hdsqhg372Y3HkdslkqPm.png",
                        releaseDate: "2021-12-15",
                        overview: "A b c overview",
                        actorsStarring: [],
                      },
                    ],
                  },
                ]),
              };
              // data for test : should return actors' minimal informations
            } else {
              return {
                toArray: jest.fn().mockResolvedValue([
                  {
                    _id: "5176a34f4f8e634b6d9fb014",
                    firstName: "Gaël",
                    lastName: "Meignen",
                  },
                  {
                    _id: "5176a34f4f8e634b6d9fb014",
                    firstName: "Gaël2",
                    lastName: "Meign2",
                  },
                ]),
              };
            }
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
          case "getActorsFromBigQuery":
            return [
              {
                getQueryResults: jest.fn().mockResolvedValue([
                  [
                    {
                      _id: "5176a34f4f8e634b6d9fb002",
                      firstName: "Gaël",
                      lastName: "Meignen",
                      pictureUrl: "/jdskBBNS90Jnds2.png",
                      starredIn: [],
                    },
                    {
                      _id: "5176a34f4f8e634b6d9fb003",
                      firstName: "Gaël2",
                      lastName: "Meign2",
                      pictureUrl: "/jdskBBNS90Jnds3.png",
                      starredIn: [],
                    },
                  ],
                ]),
              },
            ];
          case "getActorByIdFromBigQuery":
            return [
              {
                getQueryResults: jest.fn().mockResolvedValue([
                  [
                    {
                      _id: "5176a34f4f8e634b6d9fb002",
                      firstName: "Gaël",
                      lastName: "Meignen",
                      pictureUrl: "/jdskBBNS90Jnds2.png",
                      starredIn: [
                        {
                          _id: "5176a34f4f8e634b6d9fb012",
                          title: "Les évadés",
                          posterPath: "/PCLMSDldslk094029032.png",
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

var getQueryResultsValue = "";

describe("actors mongoDB", () => {
  it("should return an array of actor", async () => {
    expect(await actorsService.getActorsFromMongoDB()).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        firstName: "Gaël",
        lastName: "Meignen",
        pictureUrl: "/hdsqhg372Y3HJ32.png",
        starredIn: [
          {
            _id: "5176a34f4f8e634b6d9fb014",
            title: "La ligne verte",
            posterPath: "/hdsqhg372Y3HJ32.png",
            releaseDate: "2021-12-12",
            overview: "A beautiful overview",
            actorsStarring: [],
          },
        ],
      },
      {
        _id: "5176a34f4f8e634b6d9fb003",
        firstName: "Gaël2",
        lastName: "Meign2",
        pictureUrl: "/hdsqhg372Y3HJ35.png",
        starredIn: [
          {
            _id: "5176a34f4f8e634b6d9fb022",
            title: "La ligne",
            posterPath: "/hdsqhg372Y3HkdslkqPm.png",
            releaseDate: "2021-12-15",
            overview: "A b c overview",
            actorsStarring: [],
          },
        ],
      },
    ]);
  });

  it("should return an actor from its id", async () => {
    expect(
      await actorsService.getActorByIdFromMongoDB("5176a34f4f8e634b6d9fb014")
    ).toEqual({
      _id: "5176a34f4f8e634b6d9fb014",
      firstName: "Gaël",
      lastName: "Meignen",
      pictureUrl: "/ldsqkldsqkl04920.png",
      starredIn: [
        {
          _id: "5176a34f4f8e634b6d9fb014",
          title: "La ligne verte",
          posterPath: "/hdsqhg372Y3HJ32.png",
          releaseDate: "",
          overview: "",
          actorsStarring: [],
        },
        {
          _id: "5176a34f4f8e634b6d9fb022",
          title: "La ligne",
          posterPath: "/hdsqhg372Y3HkdslkqPm.png",
          releaseDate: "",
          overview: "",
          actorsStarring: [],
        },
      ],
    });
  });

  it("should return an actor's minimal informations", async () => {
    expect(
      await actorsService.getActorsMinimalInformationsByArrayIdFromMongoDB([
        { _id: "5176a34f4f8e634b6d9fb014" },
        { _id: "5176a34f4f8e634b6d9fb022" },
      ])
    ).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb014",
        firstName: "Gaël",
        lastName: "Meignen",
        pictureUrl: "",
        starredIn: [],
      },
      {
        _id: "5176a34f4f8e634b6d9fb014",
        firstName: "Gaël2",
        lastName: "Meign2",
        pictureUrl: "",
        starredIn: [],
      },
    ]);
  });
});

describe("actors BigQuery", () => {
  it("should return an array of actors ", async () => {
    getQueryResultsValue = "getActorsFromBigQuery";
    expect(await actorsService.getActorsFromBigQuery()).toEqual([
      {
        _id: "5176a34f4f8e634b6d9fb002",
        firstName: "Gaël",
        lastName: "Meignen",
        pictureUrl: "/jdskBBNS90Jnds2.png",
        starredIn: [],
      },
      {
        _id: "5176a34f4f8e634b6d9fb003",
        firstName: "Gaël2",
        lastName: "Meign2",
        pictureUrl: "/jdskBBNS90Jnds3.png",
        starredIn: [],
      },
    ]);
  });
  it("should return an actor from its id", async () => {
    getQueryResultsValue = "getActorByIdFromBigQuery";
    expect(await actorsService.getActorByIdFromBigQuery(123)).toEqual({
      _id: "5176a34f4f8e634b6d9fb002",
      firstName: "Gaël",
      lastName: "Meignen",
      pictureUrl: "/jdskBBNS90Jnds2.png",
      starredIn: [
        {
          _id: "5176a34f4f8e634b6d9fb012",
          title: "Les évadés",
          posterPath: "/PCLMSDldslk094029032.png",
          releaseDate: "",
          overview: "",
          actorsStarring: [],
        },
      ],
    });
  });

  it("should return an empty actor if its id is unknown", async () => {
    getQueryResultsValue = "";
    expect(await actorsService.getActorByIdFromBigQuery(123)).toEqual({
      _id: undefined,
      firstName: "",
      lastName: "",
      pictureUrl: "",
      starredIn: [],
    });
  });

  it("should return an actor's minimal informations", async () => {});
});
