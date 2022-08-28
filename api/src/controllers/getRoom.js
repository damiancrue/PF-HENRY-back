const { Room, Display, Movie } = require('../db');
const { Op } = require('sequelize')

const getRoom = async () => {
   const movie = await Movie.findAll({})
   return movie
}
module.exports = { getRoom }
/* where: {
   [Op.or]: [
      { display: "2D" },
      { display: "3D" },
      { display: "4D" },
   ]
},
include: {
   model: Display
} */