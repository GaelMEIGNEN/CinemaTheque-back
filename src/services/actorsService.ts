import bigQueryConf from "./conf/bigQueryConfiguration";
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
    const query = `SELECT * FROM ${bigQueryConf.actorsTable}`;
    const options = {
      query: query,
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },

  // TODO : modify SQL to gather movies within the query
  async getActorByIdFromBigQuery(id: Number): Promise<Actor> {
    const moviesStarredIn: Movie[] = [];

    const query = `
    SELECT a.id as aId, a.firstName as aFirstName, a.lastName as aLastName, a.pictureUrl as aPictureUrl, m.id as mId, m.title as mTitle, m.posterPath as mPosterPath, m.releaseDate as mReleaseDate FROM \`${bigQueryConf.moviesTable}\` AS m JOIN \`${bigQueryConf.actorsTable}\` AS a ON (cast(mId as string)) IN UNNEST (split(a.moviesId, ";")) WHERE aId = @id;`;

    const options = {
      query: query,
      params: { id: id },
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    var actorJson = rows[0];
    rows.forEach((actorRow: Actor) => {
      if (actorRow._id == actorJson._id) {
        actorRow.starredIn?.map((movie: Movie) => {
          moviesStarredIn.push(
            new Movie(
              movie._id,
              movie.title,
              movie.posterPath,
              movie.releaseDate,
              movie.overview,
              []
            )
          );
        });
      }
    });

    return new Promise((resolve, reject) => {
      if (rows[0]) {
        const actor: Actor = rows[0];
        resolve(
          new Actor(
            actor._id,
            actor.firstName,
            actor.lastName,
            actor.pictureUrl,
            moviesStarredIn
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
  async getActorsMinimalInformationsByArrayIdFromBigQuery(
    id: Number[]
  ): Promise<Actor[]> {
    const query = `SELECT id, firstName, lastName FROM ${bigQueryConf.actorsTable} WHERE id IN UNNEST (@id)`;

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

  getActorsFromMongoDB: async (): Promise<Actor[]> => {
    await mongoDBClient.connect();

    const results = await mongoDBClient
      .db()
      .collection<Actor>("actors")
      .find()
      .toArray();

    return results;
  },

  getActorByIdFromMongoDB: async (id: string): Promise<Actor> => {
    var movies: Movie[] = [];
    await mongoDBClient.connect();

    const result = await mongoDBClient
      .db()
      .collection<Actor>("actors")
      .findOne({ _id: new ObjectId(id) });

    if (result) {
      if (result.starredIn) {
        movies =
          await moviesService.getMoviesMinimalInformationsByArrayIdFromMongoDB(
            result.starredIn
          );
      }
    }

    return new Promise((resolve, reject) => {
      if (result) {
        resolve(
          new Actor(
            result._id,
            result.firstName,
            result.lastName,
            result.pictureUrl,
            movies
          )
        );
      }
    });
  },

  getActorsMinimalInformationsByArrayIdFromMongoDB: async (
    actors: Actor[]
  ): Promise<Actor[]> => {
    await mongoDBClient.connect();

    const strIds: readonly string[] = actors.map((actor) => {
      return actor._id;
    });

    const result = await mongoDBClient
      .db()
      .collection<Actor>("actors")
      .find({ _id: { $in: strIds } })
      .toArray();

    const finalResults = result.map((actor) => {
      return new Actor(
        actor._id,
        actor.firstName,
        actor.lastName,
        actor.pictureUrl,
        actor.starredIn
      );
    });

    return finalResults;
  },
};

export class Actor {
  _id: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
  starredIn?: Movie[];

  constructor(
    _id: string,
    firstName?: string,
    lastName?: string,
    pictureUrl?: string,
    starredIn?: Movie[]
  ) {
    this._id = _id;
    this.firstName = firstName || "";
    this.lastName = lastName || "";
    this.pictureUrl = pictureUrl || "";
    this.starredIn = starredIn || [];
  }
}

export default actorsService;
