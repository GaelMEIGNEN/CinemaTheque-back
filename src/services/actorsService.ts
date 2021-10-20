import conf from "./bigQueryConfiguration";
import { BigQuery } from "@google-cloud/bigquery";
import { Movie, moviesService } from "./moviesService";

const bigQuery = new BigQuery();

export const actorsService = {
  getActorsFromDatabase: async (): Promise<Actor[]> => {
    const query = `SELECT * FROM ${conf.actorsTable}`;
    const options = {
      query: query,
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },

  async getActorById(id: Number): Promise<Actor> {
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
        moviesList.push(await moviesService.getMovieById(parseInt(movieId)));
      });
    }

    return new Promise((resolve, reject) => {
      if (rows[0]) {
        const actor: Actor = rows[0];
        resolve(
          new Actor(
            actor.id,
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
  async getActorsMinimalInformations(id: Number[]): Promise<Actor[]> {
    const query = `SELECT id, firstName, lastName FROM ${conf.actorsTable} WHERE id IN UNNEST (@id)`;

    const options = {
      query: query,
      params: { id: id },
    };

    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },
};

export class Actor {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  starredIn: Movie[];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    pictureUrl: string,
    starredIn: Movie[]
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pictureUrl = pictureUrl;
    this.starredIn = starredIn;
  }
}
