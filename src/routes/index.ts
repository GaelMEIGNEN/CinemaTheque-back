import express from "express";
import filmsRouter from "./filmsRouter";

const router = express.Router();

router.use("/films", filmsRouter);

export default router;
