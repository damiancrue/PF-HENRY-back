const { Movie } = require("../db");

const activateMovies = async (id) => {
  const movie = await Movie.findByPk(id);
  if (movie) {
    await movie.update({
      active: true,
    });
    return true;
  } else {
    return false;
  }
};

module.exports = {
    activateMovies,
};
