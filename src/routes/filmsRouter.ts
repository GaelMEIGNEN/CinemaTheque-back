import express from "express";
import filmsController from "../controllers/filmsController";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const films = await filmsController.getFilms();
    res.header("Access-Control-Allow-Origin", "*").status(200).json(films);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
