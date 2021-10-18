import { Actor } from "./actorsService";
import moviesQuery from "./../bigquery/moviesQuery";

export const moviesService = {
  getMoviesFromDatabase: async (): Promise<Movie[]> => {
    const movies: Movie[] = await moviesQuery.getMovies();
    movies.forEach((movie) => {
      movie.posterPath = "https://image.tmdb.org/t/p/w500/" + movie.posterPath;
    });

    return movies;
  },
  getMovieByIdFromDatabase: async (id: number): Promise<Movie> => {
    const movie: Movie = await moviesQuery.getMovieById(id);
    movie.posterPath = "https://image.tmdb.org/t/p/w500/" + movie.posterPath;
    return movie;
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
