import express from "express";
import router from "./routes";

const app = express();

app.use("/api", router);
// app.use("*", async (err, req, res, next) => {
//   console.error(err);
//   res.status(500);
// });

export default app;
