const { Movie } = require("../db");

const putMovies = async (id, data) => {
  const {
    title,
    description,
    poster,
    image_1,
    image_2,
    teaser,
    genre,
    display,
    classification,
    cast,
    director,
    writter,
    language,
    duration,
    comingSoon,
  } = data;

  const movie = await Movie.findByPk(id);
  if (movie) {
    const result = await movie.update({
      title,
      description,
      poster,
      image_1,
      image_2,
      teaser,
      genre,
      display,
      classification,
      cast,
      director,
      writter,
      language,
      duration: parseInt(duration),
      comingSoon: comingSoon === "true" ? true : false,
    });
    return result;
  }
  return false;
};

module.exports = {
  putMovies,
};
