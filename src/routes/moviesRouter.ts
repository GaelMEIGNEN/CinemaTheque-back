import express from "express";
import moviesController from "../controllers/moviesController";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const movies = await moviesController.getMovies();

    res.header("Access-Control-Allow-Origin", "*").status(200).json(movies);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id && parseInt(req.params.id) >= 0) {
      const movie = await moviesController.getMovieById(
        parseInt(req.params.id)
      );
      res.header("Access-Control-Allow-Origin", "*").status(200).json(movie);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
