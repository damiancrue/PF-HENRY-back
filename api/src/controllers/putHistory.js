const { PurchaseHistory } = require("../db");

const putHistory = async (history_id, data) => {
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
  const history = await PurchaseHistory.update(
    {
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
    },
    {
      where: {
        history_id,
      },
    }
  );
  return history;
};

module.exports = {
  putHistory,
};
