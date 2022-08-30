const { DataTypes } = require("sequelize");

// Table cine.products{
//     product_id int [pk, increment]
//     name varchar
//     stock integer
//     price float
//   }

module.exports = (sequelize) => {
  sequelize.define("Product", {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaulValue: 0,
    },
    price: {
      type: DataTypes.FLOAT(2),
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    image: {
      type: DataTypes.STRING,
    },
  });
};
