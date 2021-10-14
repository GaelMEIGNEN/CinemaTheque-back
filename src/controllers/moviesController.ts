import { moviesService } from "../services/moviesService";

const moviesController = {
  getMovies: () => {
    try {
      return moviesService.getMoviesFromDatabase();
    } catch (error) {}
  },
};

export default moviesController;
