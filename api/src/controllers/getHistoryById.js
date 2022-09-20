const { PurchaseHistory } = require("../db");

const getHistoryById = async (history_id) => {
  return await PurchaseHistory.findByPk(history_id);
};

module.exports = {
  getHistoryById,
};
