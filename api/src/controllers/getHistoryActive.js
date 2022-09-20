const { PurchaseHistory } = require("../db");

const getHistoryActive = async () => {
  return await PurchaseHistory.findAll({
    where: {
      active: true,
    },
  });
};

module.exports = {
  getHistoryActive,
};
