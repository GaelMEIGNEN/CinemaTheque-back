import express from "express";
import router from "./routes";

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("hello");
});
app.use("/", router);

export default app;
