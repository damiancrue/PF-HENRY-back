const { Purchase } = require("../db");

const deletePurchase = async (purchase_id) => {
   const purchase = await Purchase.findByPk(purchase_id);
   if (purchase) {
      await purchase.update({
         active: false,
      });
      return true;
   } else {
      return false;
   }
};

module.exports = {
   deletePurchase,
};
