const { Room } = require("../db");

const deleteRoom = async (id) => {
   const room = await Room.findByPk(id);
   if (room) {
      await room.update({
         active: false,
      });
      return true;
   } else {
      return false;
   }
};

module.exports = {
   deleteRoom,
};
