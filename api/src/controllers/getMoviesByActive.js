const { Movie } = require("../db");
// const { Op } = require("sequelize");

const getMoviesByActive = async (active) => {
  return await Movie.findAll({
    where: {
      active: active,
    },
  });
};

module.exports = {
  getMoviesByActive,
};
