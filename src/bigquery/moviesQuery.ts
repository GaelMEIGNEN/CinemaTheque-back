import { BigQuery } from "@google-cloud/bigquery";
import { Movie } from "../services/moviesService";
const bigQuery = new BigQuery();
const dataSource = "hubvisory-game.CinemaTheque";

export async function getMovies(): Promise<Movie[]> {
  const query = `SELECT * FROM \`${dataSource}.movies\``;
  const options = {
    query: query,
    location: "US",
  };
  const [job] = await bigQuery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  const [rows] = await job.getQueryResults();

  //   console.log("Rows: ");
  //   rows.forEach((elem) => {
  //     console.log(elem);
  //   });

  return rows;
}
