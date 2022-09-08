const { Movie } = require("../db");
const { Op } = require("sequelize");

const getMoviesByName = async (name) => {
  return await Movie.findAll({
    where: {
      title: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });
};

module.exports = {
  getMoviesByName,
};
