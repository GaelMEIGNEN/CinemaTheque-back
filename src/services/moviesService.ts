import axios from "axios";
import { Actor } from "./actorsService";
import { getMovies } from "./../bigquery/moviesQuery";

export const moviesService = {
  getMoviesFromDatabase: async (): Promise<Movie[]> => {
    const movies: Movie[] = await getMovies();
    movies.forEach((movie) => {
      movie.poster_path =
        "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
    });
    console.log(movies);
    // getMovies().then((moviesList) => {
    //   moviesList.map((movie) => {
    //     console.log(movie);
    //     movies.push(
    //       new movie(movie.id, movie.title, movie.poster_path, movie.overview, [])
    //     );
    //   });
    // });
    console.log("test");
    console.log(movies[0]);
    return movies;
  },
};

export class Movie {
  id: string;
  title: string;
  poster_path: string;
  overview: string;
  actorsStarring: Actor[];

  constructor(
    id: string,
    title: string,
    poster_path: string,
    overview: string,
    actorsStarring: Actor[]
  ) {
    this.id = id;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.actorsStarring = actorsStarring;
  }
}
