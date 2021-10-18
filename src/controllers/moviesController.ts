import { moviesService } from "../services/moviesService";

const moviesController = {
  getMovies: () => {
    try {
      return moviesService.getMoviesFromDatabase();
    } catch (error) {
      console.log(error);
    }
  },
  getMovieById: (id: number) => {
    try {
      return moviesService.getMovieByIdFromDatabase(id);
    } catch (error) {
      console.log(error);
    }
  },
};

export default moviesController;
