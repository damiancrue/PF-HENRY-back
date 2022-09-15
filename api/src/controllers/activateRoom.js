const { Room } = require("../db");

const activateRoom = async (id) => {
  const room = await Room.findByPk(id);
  if (room) {
    await room.update({
      active: true,
    });
    return true;
  } else {
    return false;
  }
};

module.exports = {
  activateRoom,
};
