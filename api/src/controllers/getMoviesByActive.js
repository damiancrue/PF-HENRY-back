const { Movie, Rating } = require("../db");
const { Op } = require("sequelize");

const getMoviesByActive = async (active) => {
  return await Movie.findAll({
    where: {
      active: active,
    },
    include: {
      model: Rating,
      attributes: ["rate", "review"],
      throught: {
        attributes: ["movie_id"],
      },
    },
  });
};

module.exports = {
  getMoviesByActive,
};
