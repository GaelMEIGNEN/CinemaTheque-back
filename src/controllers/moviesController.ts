import { moviesService, Movie } from "../services/moviesService";

const moviesController = {
  getMovies: async (): Promise<Movie[]> => {
    try {
      let results = await moviesService.getMoviesFromMongoDB();
      if (results.length > 0) {
        return results;
      } else {
        return await moviesService.getMoviesFromBigQuery();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getMovieById: async (id: string): Promise<Movie> => {
    try {
      // return moviesService.getMovieByIdFromBigQuery(id);
      let result = await moviesService.getMovieByIdFromMongoDB(id);
      if (result._id && result._id.length > 0) {
        return result;
      } else {
        return await moviesService.getMovieByIdFromBigQuery(parseInt(id));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default moviesController;
