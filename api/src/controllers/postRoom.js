const { Room } = require('../db');

const postRoom = async (data) => {
   const { name, room_seats, display_type } = data
   const room = await Room.create({
      name, room_seats, display_type
   })
   return room
}
module.exports = {
   postRoom
}