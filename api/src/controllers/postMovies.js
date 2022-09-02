const { Movie } = require("../db");

const postMovies = async (data) => {
  const {
    title,
    description,
    poster,
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

  const movie = await Movie.create({
    title,
    description,
    poster,
    teaser,
    genre,
    display,
    duration: parseInt(duration),
    classification,
    cast,
    director,
    writter,
    language,
    comingSoon: comingSoon === "true" ? true : false,
  });
  return movie;
};

module.exports = {
  postMovies,
};
