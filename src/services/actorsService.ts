import { Movie } from "./moviesService";

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
