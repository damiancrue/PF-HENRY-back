const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("PurchaseHistory", {
    history_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
    },
    seats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    room: {
      type: DataTypes.INTEGER,
    },
    schedule_day: {
      type: DataTypes.DATEONLY,
    },
    schedule_time: {
      type: DataTypes.TIME,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    time: {
      type: DataTypes.TIME,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    state: {
      type: DataTypes.STRING,
    },
    product_qty: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
