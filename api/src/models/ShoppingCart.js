const { DataTypes } = require("sequelize");

// Table purchase.detail{
//     detail_id int [pk, increment]
//     purchase_id <-- de la tabla de las compras
//     schedule_id <--- de la tabla de las proyecciones
//     quantity  <-- cantidad de tickets
//     product_id <-- de la tabla de productos
//     quantity_product <-- cantidad de productos comprados
//   }

module.exports = (sequelize) => {
  sequelize.define("ShoppingCart", {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    products: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    },
    schedules: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
  });
};
