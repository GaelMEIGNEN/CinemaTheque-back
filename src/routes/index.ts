import express from "express";
import moviesRouter from "./moviesRouter";

const router = express.Router();

router.use("/movies", moviesRouter);

export default router;
