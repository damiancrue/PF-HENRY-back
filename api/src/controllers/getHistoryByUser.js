const { PurchaseHistory } = require("../db");

const getHistoryByUser = async (user_email) => {
  return await PurchaseHistory.findAll({
    where: {
      user_email,
    },
  });
};

module.exports = {
  getHistoryByUser,
};
