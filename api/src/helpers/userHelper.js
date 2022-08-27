const { Role, Op } = require("../db.js");

module.exports = {
  getRoleID: async (roleName) => {
    const userRoleObject = await Role.findOne({
      where: { name: roleName },
    });
    return userRoleObject.role_id;
  },
};
