const { PurchaseHistory } = require("../db");

const getHistoryDelete = async () => {
  return await PurchaseHistory.findAll({
    where: {
      active: false,
    },
  });
};

module.exports = {
  getHistoryDelete,
};
