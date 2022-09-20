const { PurchaseHistory } = require("../db");

const deleteHistory = async (history_id) => {
  const history = await PurchaseHistory.findByPk(history_id);
  if (history) {
    await history.update({
      active: false,
    });
    return true;
  } else {
    return false;
  }
};

module.exports = {
  deleteHistory,
};
