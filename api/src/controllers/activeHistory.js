const { PurchaseHistory } = require("../db");

const activeHistory = async (history_id) => {
  const history = await PurchaseHistory.findByPk(history_id);
  if (history) {
    await history.update({
      active: true,
    });
    return true;
  } else {
    return false;
  }
};

module.exports = {
  activeHistory,
};
