import actorsQuery from "./../bigquery/actorsQuery";
import { Movie } from "./moviesService";

export const actorsService = {
  getActorsFromDatabase: async (): Promise<Actor[]> => {
    const actors: Actor[] = await actorsQuery.getActors();

    return actors;
  },
};

export class Actor {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  starredIn: Movie[];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    pictureUrl: string,
    starredIn: Movie[]
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pictureUrl = pictureUrl;
    this.starredIn = starredIn;
  }
}
