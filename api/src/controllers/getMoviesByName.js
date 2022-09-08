const { Movie, Rating } = require("../db");
const { Op } = require("sequelize");

const getMoviesByName = async (name) => {
  return await Movie.findAll({
    where: {
      title: {
        [Op.iLike]: `%${name}%`,
      },
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
  getMoviesByName,
};
