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
  sequelize.define("ScheduleDetail", {
    detail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schedule_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    seat_numbers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT(2),
    },
  });
};
