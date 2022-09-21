const { PurchaseHistory } = require("../db");

const postHistory = async (data) => {
  const {
    movie_id,
    seats,
    schedule_day,
    schedule_time,
    room,
    user_email,
    date,
    time,
    amount,
    state,
    product_qty,
  } = data;
  const history = await PurchaseHistory.create({
    movie_id: parseInt(movie_id),
    seats,
    schedule_day,
    schedule_time,
    room: parseInt(room),
    user_email,
    date,
    time,
    amount: parseFloat(amount),
    state,
    product_qty,
  });
  return history;
};

module.exports = {
  postHistory,
};
