const { Movie } = require("../db");

const getMovies = async () => {
  return await Movie.findAll();
};

module.exports = {
  getMovies,
};
