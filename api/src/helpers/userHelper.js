const { Role, User, Op } = require("../db.js");

module.exports = {
  getRoleID: async (roleName) => {
    const userRoleObject = await Role.findOne({
      where: { name: roleName },
    });
    return userRoleObject.role_id;
  },
  getUsersOptionalParameter: (active) => {
    if (active !== undefined);
    return {
      where: {
        active: active,
      },
    };
    return;
  },
  getUserID: async (email) => {
    const userID = await User.findAll({ where: { email: email } });
    if (userID.length === 0) {
      return false;
    } else {
      return true;
    }
  },
};
