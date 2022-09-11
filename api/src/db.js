require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_URI } = process.env;

const sequelize = new Sequelize(DB_URI, {
  dialect: "postgresql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  native: false,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

//Se comentan las tablas que no se usan mas
const {
  User,
  Movie,
  //Detail,
  //Display,
  //Genre,
  Product,
  Purchase,
  ProductDetail,
  ScheduleDetail,
  //PurchaseStatus,
  Rating,
  Room,
  Schedule,
  //BoughtSeats,
  //Role,
} = sequelize.models;

//Relaciones nuevas

User.hasMany(Purchase, { foreignKey: "user_id" });
Purchase.belongsTo(User, { foreignKey: "user_id" });
Purchase.hasMany(ProductDetail, { foreignKey: "purchase_id" });
ProductDetail.belongsTo(Purchase, { foreignKey: "purchase_id" });
Purchase.hasMany(ScheduleDetail, { foreignKey: "purchase_id" });
ScheduleDetail.belongsTo(Purchase, { foreignKey: "purchase_id" });

Rating.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Rating, { foreignKey: "user_id" });
Rating.belongsTo(Movie, { foreignKey: "movie_id" });
Movie.hasMany(Rating, { foreignKey: "movie_id" });
Schedule.belongsTo(Movie, { foreignKey: "movie_id" });
Movie.hasMany(Schedule, { foreignKey: "movie_id" });
ProductDetail.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductDetail, { foreignKey: "product_id" });
ScheduleDetail.belongsTo(Schedule, { foreignKey: "schedule_id" });
Schedule.hasMany(Schedule, { foreignKey: "schedule_id" });
Schedule.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(Schedule, { foreignKey: "room_id" });

//Relaciones viejas pero no tanto
// User.hasMany(Rating, { foreignKey: "user_id" });
// User.hasMany(Purchase, { foreignKey: "user_id" });
// Movie.hasMany(Rating, { foreignKey: "movie_id" });
// Movie.hasMany(Schedule, { foreignKey: "movie_id" });
// Purchase.hasMany(ProductDetail, { foreignKey: "purchase_id" });
// Purchase.hasMany(ScheduleDetail, { foreignKey: "purchase_id" });
// Product.hasMany(ProductDetail, { foreignKey: "product_id" });
// Schedule.hasMany(ScheduleDetail, { foreignKey: "schedule_id" });
// Room.hasMany(Schedule, { foreignKey: "room_id" });

//Relaciones viejas
// Rating.hasOne(Movie);
// Rating.hasOne(User);
// User.hasMany(Rating);
// User.hasOne(Role);
// Movie.hasMany(Rating);
// PurchaseStatus.hasMany(Purchase);
// Purchase.hasOne(PurchaseStatus);
// User.hasMany(Purchase);
// Purchase.hasOne(User);
// Purchase.hasMany(Detail);
// Detail.hasOne(Purchase);
// Detail.belongsToMany(Product, { through: "DetailProduct" });
// Product.belongsToMany(Detail, { through: "DetailProduct" });
// Movie.belongsToMany(Genre, { through: "MovieGenre" });
// Genre.belongsToMany(Movie, { through: "MovieGenre" });
// Movie.belongsToMany(Display, { through: "MovieDisplay" });
// Display.belongsToMany(Movie, { through: "MovieDisplay" });
// Room.hasOne(Display);
// Display.hasMany(Room);
// Schedule.hasOne(Room);
// Schedule.hasOne(Movie);
// Schedule.hasOne(Display); // para mi ya la trae la room //
// Room.hasMany(Schedule);
// Movie.hasMany(Schedule);
// Display.hasMany(Schedule); // para mi ya estan relacionados por medio de la room//
// BoughtSeats.hasOne(Purchase); // Relación 1:1 con purchase porque una selección de butacas es una compra y una compra solo puede tener una selección de butacas
// Purchase.hasOne(BoughtSeats);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importar la conexión { conn } = require('./db.js');
};
