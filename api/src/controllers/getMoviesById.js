const { Movie, Rating } = require("../db");

const getMoviesById = async (id) => {
  return await Movie.findByPk(id, {
    include: {
      model: Rating,
      attributes: ["movie_id", "rate", "review", "user_id"],
      throught: {
        attributes: ["movie_id"],
      },
    },
  });
};

module.exports = {
  getMoviesById,
};
