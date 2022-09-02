const { Room } = require('../db');

const putRooms = async (id, data) => {
   const { name, room_seats, display_type } = data
   const room = await Room.findByPk(id);
   if (room) {
      const result = await room.update({
         name, room_seats, display_type
      });
      return result
   }
   return false
};
module.exports = { putRooms }