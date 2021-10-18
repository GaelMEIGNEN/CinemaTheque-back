import { BigQuery } from "@google-cloud/bigquery";
import { conf } from ".//bigQueryConfiguration";
import { Movie } from "../services/moviesService";
import { Actor } from "../services/actorsService";
import actorsQuery from "./actorsQuery";

const bigQuery = new BigQuery();

const moviesQuery = {
  async getMovies(): Promise<Movie[]> {
    const query = `SELECT * FROM \`${conf.moviesTable}\``;
    const options = {
      query: query,
      location: "US",
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    return rows;
  },
  async getMovieById(id: number): Promise<Movie> {
    var actorsList: Actor[] = [];
    const query = `SELECT * FROM \`${conf.moviesTable}\` WHERE id = @id LIMIT 1`;

    const options = {
      query: query,
      params: { id: id },
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();
    console.log(rows);
    if (rows[0]) {
      if (rows[0].actorsId) {
        const actors: string[] = rows[0].actorsId.split(";");
        const actorsId = actors
          .filter((actorId) => actorId.length > 0)
          .map((actorId) => parseInt(actorId));
        actorsList = await actorsQuery.getActorsMinimalInformations(actorsId);
      }
    }

    return new Promise((resolve, reject) => {
      if (rows[0]) {
        const movie: Movie = rows[0];
        resolve(
          new Movie(
            movie.id,
            movie.title,
            movie.posterPath,
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
};

export default moviesQuery;
