import bigQueryConf from "./conf/bigQueryConfiguration";
import mongoDBConf from "./conf/mongoDBConfiguration";
import { MongoClient, ObjectId } from "mongodb";
import { BigQuery } from "@google-cloud/bigquery";
import { Actor } from "./actorsService";
import { actorsService } from "./actorsService";

const bigQuery = new BigQuery();
const mongoDBClient = new MongoClient(mongoDBConf.uri);
//TODO : Every input of BQ/MongoDB functions must of the same types (not ObjectId/string ie)
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

    return rows;
  },

  getMovieByIdFromBigQuery: async (id: number): Promise<Movie> => {
    const actorsStarring: Actor[] = [];
    const query = `
    SELECT m.id as mId, m.title as mTitle, m.posterPath as mPosterPath, m.releaseDate as mReleaseDate, 
           a.id as aId, a.firstName as aFirstName, a.lastName as aLastName, a.pictureUrl as aPictureUrl 
    FROM \`${bigQueryConf.moviesTable}\` AS m JOIN \`${bigQueryConf.actorsTable}\` 
                                         AS a ON (cast(aId as string)) IN UNNEST (split(m.actorsId, ";")) WHERE mId = @id;`;

    const options = {
      query: query,
      params: { id: id },
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    var movieJson = rows[0];

    rows.forEach((movieRow: Movie) => {
      if (movieRow._id == movieJson._id) {
        movieRow.actorsStarring?.map((actor: Actor) => {
          actorsStarring.push(
            new Actor(
              actor._id,
              actor.firstName,
              actor.lastName,
              actor.pictureUrl,
              []
            )
          );
        });
      }
    });

    return new Promise((resolve, reject) => {
      if (movieJson) {
        var movie: Movie = movieJson;
        resolve(
          new Movie(
            movie._id,
            movie.title,
            movie.posterPath,
            movie.releaseDate,
            movie.overview,
            actorsStarring
          )
        );
      } else {
        reject(`No movie found for id : ${id}`);
      }
    });
  },

  //TODO : Create a new request to an array of actors' minimal informations by giving a string containing multiple id separated by ;

  getMoviesMinimalInformationsByArrayIdFromBigQuery: async (
    ids: string[]
  ): Promise<Movie[]> => {
    const query = `SELECT id, title, posterPath FROM \`${bigQueryConf.moviesTable}\` WHERE id IN UNNEST (@id)`;
    const options = {
      query: query,
      params: { id: ids },
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },

  /************************************************************************
   * MongoDB
   ************************************************************************/

  async getMoviesFromMongoDB(): Promise<Movie[]> {
    await mongoDBClient.connect();

    const result = await mongoDBClient
      .db()
      .collection<Movie>("movies")
      .find()
      .toArray();

    return result;
  },

  getMovieByIdFromMongoDB: async (id: string): Promise<Movie> => {
    var actors: Actor[] = [];
    await mongoDBClient.connect();

    const result = await mongoDBClient
      .db()
      .collection<Movie>("movies")
      .findOne({ _id: new ObjectId(id) });

    if (result) {
      if (result.actorsStarring)
        actors =
          await actorsService.getActorsMinimalInformationsByArrayIdFromMongoDB(
            result.actorsStarring
          );
    }
    return new Promise((resolve, reject) => {
      if (result) {
        resolve(
          new Movie(
            result._id,
            result.title,
            result.posterPath,
            result.releaseDate,
            result.overview,
            actors
          )
        );
      } else {
        reject(`No movie found for id: ${id}`);
      }
    });
  },

  getMoviesMinimalInformationsByArrayIdFromMongoDB: async (
    movies: Movie[]
  ): Promise<Movie[]> => {
    await mongoDBClient.connect();

    const strIds: readonly string[] = movies.map((movie) => {
      return movie._id;
    });

    const results = await mongoDBClient
      .db()
      .collection<Movie>("movies")
      .find({ _id: { $in: strIds } })
      .toArray();

    return results;
  },
};

export class Movie {
  _id: string;
  title?: string;
  posterPath?: string;
  releaseDate?: string;
  overview?: string;
  actorsStarring?: Actor[];

  constructor(
    _id: string,
    title?: string,
    posterPath?: string,
    releaseDate?: string,
    overview?: string,
    actorsStarring?: Actor[]
  ) {
    this._id = _id;
    this.title = title || "";
    this.posterPath = posterPath || "";
    this.releaseDate = releaseDate || "";
    this.overview = overview || "";
    this.actorsStarring = actorsStarring || [];
  }
}

export default moviesService;
