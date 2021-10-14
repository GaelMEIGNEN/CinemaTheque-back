import { filmsService } from "../services/filmsService";

const filmsController = {
  getFilms: () => {
    try {
      return filmsService.getFilmsFromTMDBAPI();
    } catch (error) {}
  },
};

export default filmsController;
