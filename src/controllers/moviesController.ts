import { moviesService } from "../services/moviesService";
import { ObjectId } from "mongodb";

const moviesController = {
  getMovies: () => {
    try {
      // return moviesService.getMoviesFromBigQuery();
      return moviesService.getMoviesFromMongoDB();
    } catch (error) {
      console.log(error);
    }
  },
  getMovieById: (id: string) => {
    try {
      // return moviesService.getMovieByIdFromBigQuery(id);
      return moviesService.getMovieByIdFromMongoDb(id);
    } catch (error) {
      console.log(error);
    }
  },
};

export default moviesController;
