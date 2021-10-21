import conf from "./bigQueryConfiguration";
import { BigQuery } from "@google-cloud/bigquery";
import { Actor } from "./actorsService";
import { actorsService } from "./actorsService";

const bigQuery = new BigQuery();

export const moviesService = {
  getMovies: async (): Promise<Movie[]> => {
    const query = `SELECT id, title, posterPath FROM \`${conf.moviesTable}\``;
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
  getMovieById: async (id: number): Promise<Movie> => {
    var actorsList: Actor[] = [];
    const query = `SELECT * FROM \`${conf.moviesTable}\` WHERE id = @id LIMIT 1`;

    const options = {
      query: query,
      params: { id: id },
    };
    const [job] = await bigQuery.createQueryJob(options);

    const [rows] = await job.getQueryResults();

    if (rows[0]) {
      if (rows[0].actorsId) {
        const actors: string[] = rows[0].actorsId.split(";");
        const actorsId = actors
          .filter((actorId) => actorId.length > 0)
          .map((actorId) => parseInt(actorId));
        actorsList = await actorsService.getActorsMinimalInformations(actorsId);
      }
    }

    return new Promise((resolve, reject) => {
      if (rows[0]) {
        const movie: Movie = rows[0];
        resolve(
          new Movie(
            movie.id,
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
};

export class Movie {
  id: string;
  title: string;
  posterPath: string;
  releaseDate: Date;
  overview: string;
  actorsStarring: Actor[];

  constructor(
    id: string,
    title: string,
    posterPath: string,
    releaseDate: Date,
    overview: string,
    actorsStarring: Actor[]
  ) {
    this.id = id;
    this.title = title;
    this.posterPath = posterPath;
    this.releaseDate = releaseDate;
    this.overview = overview;
    this.actorsStarring = actorsStarring;
  }
}
