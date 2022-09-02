const { Movie, Rating } = require("../db");
const { Op } = require("sequelize");

const getMoviesByNameAndActive = async (name, active) => {
  return await Movie.findAll({
    where: {
      title: {
        [Op.iLike]: `%${name}%`,
      },
      active: active,
    },
    include: {
      model: Rating,
      attributes: ["movie_id", "rate", "review"],
      throught: {
        attributes: ["movie_id"],
      },
    },
  });
};

module.exports = {
  getMoviesByNameAndActive,
};
