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
    description: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
