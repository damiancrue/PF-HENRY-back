const { Movie } = require("../db");
const { Op } = require("sequelize");

const getMoviesByNameAndActive = async (name, active) => {
  return await Movie.findAll({
    where: {
      title: {
        [Op.iLike]: `%${name}%`,
      },
      active: active,
    },
  });
};

module.exports = {
  getMoviesByNameAndActive,
};
