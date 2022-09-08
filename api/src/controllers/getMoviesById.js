const { Movie } = require("../db");

const getMoviesById = async (id) => {
  return await Movie.findByPk(id);
};

module.exports = {
  getMoviesById,
};
