const {
  Purchase,
  ProductDetail,
  ScheduleDetail,
  Schedule,
  Product,
} = require("../db.js");
const { Op } = require("sequelize");

const formatData = async (data) => {
  let productDetails = JSON.parse(JSON.stringify(data.ProductDetails));
  let scheduleDetail = JSON.parse(JSON.stringify(data.ScheduleDetails[0]));
  let productIDs = [];

  productDetails.forEach((productRecord) => {
    productRecord.product_id = productRecord.Product.product_id;
    productIDs.push(productRecord.Product.product_id);
  });
  let productStocks = await Product.findAll({
    where: {
      product_id: {
        [Op.in]: productIDs,
      },
    },
    attributes: ["product_id", "stock"],
  });
  productDetails.forEach((productRecord) => {
    let stockForProduct = productStocks.filter(
      (product) => product.product_id === productRecord.product_id
    );
    const newStock = stockForProduct[0].stock + productRecord.product_quantity;
    productRecord.newStock = newStock;
  });
  scheduleDetail.schedule_id = scheduleDetail.Schedule.schedule_id;
  scheduleDetail.boughtSeats = scheduleDetail.Schedule.boughtSeats;
  scheduleDetail.newFreeSeats = scheduleDetail.boughtSeats.filter(
    (seat) => !scheduleDetail.seat_numbers.includes(seat)
  );
  let results = {
    productDetails,
    scheduleDetail,
  };
  return results;
};

module.exports = formatData;
