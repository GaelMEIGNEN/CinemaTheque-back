import bigQueryConf from "./conf/bigQueryConfiguration";
import mongoDBConf from "./conf/mongoDBConfiguration";
import { MongoClient, ObjectId } from "mongodb";
import { BigQuery } from "@google-cloud/bigquery";
import { Actor } from "./actorsService";
import { actorsService } from "./actorsService";

const bigQuery = new BigQuery();
const mongoDBClient = new MongoClient(mongoDBConf.uri);

export const moviesService = {
  /***********************************************************************
   * BigQuery
   ************************************************************************/
  getMoviesFromBigQuery: async (): Promise<Movie[]> => {
    const query = `SELECT id, title, posterPath FROM \`${bigQueryConf.moviesTable}\``;
    const options = {
      query: query,
      location: "US",
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    rows.forEach((movie) => {
      movie.posterPath = "https://image.tmdb.org/t/p/w500/" + movie.posterPath;
    });

    return rows;
  },
  getMovieByIdFromBigQuery: async (id: number): Promise<Movie> => {
    var actorsList: Actor[] = [];
    const query = `SELECT m.id, m.title. FROM \`${bigQueryConf.moviesTable}\` m JOIN \`${bigQueryConf.actorsTable}\` a ON m.actorsId = a.id WHERE id = @id LIMIT 1`;

    const options = {
      query: query,
      params: { id: id },
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    var movieJson = rows[0];
    if (movieJson) {
      if (movieJson.actorsId) {
        const actors: string[] = movieJson.actorsId.split(";");
        const actorsId = actors
          .filter((actorId) => actorId.length > 0)
          .map((actorId) => parseInt(actorId));
        actorsList =
          await actorsService.getActorsMinimalInformationsFromBigQuery(
            actorsId
          );
      }
    }

    return new Promise((resolve, reject) => {
      if (movieJson) {
        var movie: Movie = movieJson;
        resolve(
          new Movie(
            movie._id,
            movie.title,
            "https://image.tmdb.org/t/p/w500/" + movie.posterPath,
            movie.releaseDate,
            movie.overview,
            actorsList
          )
        );
      } else {
        reject(`No movie found for id : ${id}`);
      }
    });
  },

  /************************************************************************
   * MongoDB
   ************************************************************************/

  async getMoviesFromMongoDB(): Promise<Movie[]> {
    await mongoDBClient.connect();

    const result = (await mongoDBClient
      .db()
      .collection("movies")
      .find()
      .toArray()) as Movie[];

    return result;
  },

  async getMovieByIdFromMongoDb(id: string): Promise<Movie> {
    var actors: Actor[] = [];
    await mongoDBClient.connect();
    const result = await mongoDBClient
      .db()
      .collection("movies")
      .findOne({ _id: new ObjectId(id) });

    if (result) {
      actors = await actorsService.getActorsMinimalInformationsFromMongoDB(
        result.actorsStarring
      );
    }

    return new Promise((resolve, reject) => {
      const movie: Movie = result as Movie;
      if (result) {
        resolve(
          new Movie(
            movie._id,
            movie.title,
            movie.overview,
            movie.releaseDate,
            "https://image.tmdb.org/t/p/w500/" + movie.posterPath,
            actors
          )
        );
      } else {
        reject(`No movie found for id: ${id}`);
      }
    });
  },
};

export class Movie {
  _id: string;
  title: string;
  posterPath: string;
  releaseDate: Date;
  overview: string;
  actorsStarring: Actor[];

  constructor(
    _id: string,
    title: string,
    posterPath: string,
    releaseDate: Date,
    overview: string,
    actorsStarring: Actor[]
  ) {
    this._id = _id;
    this.title = title;
    this.posterPath = posterPath;
    this.releaseDate = releaseDate;
    this.overview = overview;
    this.actorsStarring = actorsStarring;
  }
}
