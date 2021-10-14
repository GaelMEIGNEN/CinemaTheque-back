import express from "express";
import moviesController from "../controllers/moviesController";
import { getMovies } from "../bigquery/moviesQuery";

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

export default router;
