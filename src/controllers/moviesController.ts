import { moviesService } from "../services/moviesService";

const moviesController = {
  getMovies: () => {
    try {
      return moviesService.getMovies();
    } catch (error) {
      console.log(error);
    }
  },
  getMovieById: (id: number) => {
    try {
      return moviesService.getMovieById(id);
    } catch (error) {
      console.log(error);
    }
  },
};

export default moviesController;
