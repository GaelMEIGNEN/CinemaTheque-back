import { Film } from "./filmsService";

export class Actor {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  starredIn: Film[];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    pictureUrl: string,
    starredIn: Film[]
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pictureUrl = pictureUrl;
    this.starredIn = starredIn;
  }
}
