// const { Movie, Rating } = require("../db");
// const { Op } = require("sequelize");

const { getMovies } = require("../controllers/getMovies");
const { getMoviesByName } = require("../controllers/getMoviesByName");
const { getMoviesByActive } = require("../controllers/getMoviesByActive");
const {
  getMoviesByNameAndActive,
} = require("../controllers/getMoviesByNameAndActive");

const getMoviesByParameter = async (name, active) => {
  if (name && active !== undefined)
    return await getMoviesByNameAndActive(name, active);

  if (name) return await getMoviesByName(name);

  if (active !== undefined) return await getMoviesByActive(active);

  return await getMovies();
};

module.exports = {
  getMoviesByParameter,
};
