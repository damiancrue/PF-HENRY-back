const { Room, Display, Movie } = require('../db');
const { Op } = require('sequelize')

const getRoom = async () => {
   const movie = await Room.findAll()
   return movie
}
module.exports = { getRoom }
