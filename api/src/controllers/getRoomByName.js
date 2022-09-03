const { Room, Rating } = require("../db");
const { Op } = require("sequelize");

const getRoomByName = async (name) => {
   return await Room.findAll({
      where: {
         name: {
            [Op.iLike]: `%${name}%`,
         },
      },
   });
};

module.exports = {
   getRoomByName
};
