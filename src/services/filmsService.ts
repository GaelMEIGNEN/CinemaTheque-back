import axios from "axios";
import { Actor } from "./actorsService";

export const filmsService = {
  getFilmsFromTMDBAPI: async (): Promise<Film[]> => {
    const films: Film[] = [];
    films.push(
      new Film(
        "1",
        "La ligne verte",
        "https://www.lachaiselongue.fr/media/catalog/product/cache/0d98c6fefc07a4895f8f19b12bcf8dcc/3/8/38-2z-166-images-38-2z-166_1.jpg",
        "blabla",
        [new Actor("1", "Gaël", "Meignen", "NotFound", [])]
      )
    );
    films.push(
      new Film(
        "2",
        "La ligne rouge",
        "https://www.lachaiselongue.fr/media/catalog/product/cache/0d98c6fefc07a4895f8f19b12bcf8dcc/3/8/38-2z-166-images-38-2z-166_1.jpg",
        "blabla",
        [new Actor("2", "Gaël2", "Meign2", "NotFound2", [])]
      )
    );
    return films;
  },
};

export class Film {
  id: string;
  title: string;
  posterUrl: string;
  synopsis: string;
  actorsStarring: Actor[];

  constructor(
    id: string,
    title: string,
    posterUrl: string,
    synopsis: string,
    actorsStarring: Actor[]
  ) {
    this.id = id;
    this.title = title;
    this.posterUrl = posterUrl;
    this.synopsis = synopsis;
    this.actorsStarring = actorsStarring;
  }
}
