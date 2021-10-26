import conf from "./conf/bigQueryConfiguration";
import mongoDBConf from "./conf/mongoDBConfiguration";
import { MongoClient, ObjectId } from "mongodb";
import { BigQuery } from "@google-cloud/bigquery";
import { Movie, moviesService } from "./moviesService";

const bigQuery = new BigQuery();
const mongoDBClient = new MongoClient(mongoDBConf.uri);

export const actorsService = {
  /***********************************************************************
   * BigQuery
   ************************************************************************/
  getActorsFromBigQuery: async (): Promise<Actor[]> => {
    const query = `SELECT * FROM ${conf.actorsTable}`;
    const options = {
      query: query,
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },

  async getActorByIdFromBigQuery(id: Number): Promise<Actor> {
    const moviesList: Movie[] = [];
    const query = `SELECT * FROM ${conf.actorsTable} WHERE id = @id LIMIT 1`;

    const options = {
      query: query,
      params: { id: id },
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    if (rows[0]) {
      const movies: string[] = rows[0].moviesId.split(";");

      movies.forEach(async (movieId) => {
        moviesList.push(
          await moviesService.getMovieByIdFromBigQuery(parseInt(movieId))
        );
      });
    }

    return new Promise((resolve, reject) => {
      if (rows[0]) {
        const actor: Actor = rows[0];
        resolve(
          new Actor(
            actor._id,
            actor.firstName,
            actor.lastName,
            actor.pictureUrl,
            moviesList
          )
        );
      } else {
        reject(`No actor found for id : ${id}`);
      }
    });
  },

  /*
   * From a list of id, finds minimal informations (id, firstName, lastName) about these actors
   */
  async getActorsMinimalInformationsFromBigQuery(
    id: Number[]
  ): Promise<Actor[]> {
    const query = `SELECT id, firstName, lastName FROM ${conf.actorsTable} WHERE id IN UNNEST (@id)`;

    const options = {
      query: query,
      params: { id: id },
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },

  /************************************************************************
   * MongoDB
   ************************************************************************/

  async getActorsMinimalInformationsFromMongoDB(
    ids: ObjectId[]
  ): Promise<Actor[]> {
    await mongoDBClient.connect();

    const result = (await mongoDBClient
      .db()
      .collection("actors")
      .find({ _id: { $in: ids } })
      .toArray()) as Actor[];

    return result;
  },
};

export class Actor {
  _id: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  starredIn: Movie[];

  constructor(
    _id: string,
    firstName: string,
    lastName: string,
    pictureUrl: string,
    starredIn: Movie[]
  ) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pictureUrl = pictureUrl;
    this.starredIn = starredIn;
  }
}
