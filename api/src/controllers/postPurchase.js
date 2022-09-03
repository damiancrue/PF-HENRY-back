/* const { Purchase, ProductDetail, ScheduleDetail } = require("../db");

const postPurchase = async (data) => {
  const {
    amount,
    status_id,
    product_quantity,
    schedule_quantity,
    seat_numbers,
  } = data;

  const purchase = await Purchase.create({
    amount: parseFloat(amount),
    status_id: status_id === "true" ? true : false,
  });
  const productDetail = await ProductDetail.create({
    purchase_id: purchase.purchase_id, // no esta en el model pero desconozco si hay que incluirlo por tema de la relación.
    product_quantity: parseInt(product_quantity),
  });
  const scheduleDetail = await ScheduleDetail.create({
    purchase_id: purchase.purchase_id, // no esta en el model pero desconozco si hay que incluirlo por tema de la relación.
    schedule_quantity: parseInt(schedule_quantity),
    seat_numbers, // verificar si por body se recibe el json o si hay que convertirlo.
  });
  return purchase;
};

module.exports = {
  postPurchase,
};
 */

/* const { Purchase, ProductDetail, User } = require("../db");

const postPurchase = async (data) => {
  const purchase = await Purchase.create({
    include: User
  })
  console.log(purchase)
}
module.exports = { postPurchase } */