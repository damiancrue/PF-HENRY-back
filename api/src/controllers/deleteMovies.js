const { Movie } = require("../db");

const deleteMovies = async (id) => {
  const movie = await Movie.findByPk(id);
  if (movie) {
    await movie.destroy();
    return true;
  } else {
    return false;
  }
};

module.exports = {
  deleteMovies,
};
