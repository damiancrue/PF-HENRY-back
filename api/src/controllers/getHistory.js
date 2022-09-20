const { PurchaseHistory } = require("../db");

const getHistory = async () => {
  return await PurchaseHistory.findAll();
};

module.exports = {
  getHistory,
};
