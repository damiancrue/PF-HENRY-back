const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const loadData = require("./src/helpers/loadData.js"); //Agrega los roles cada vez que se inicializa la base de datos
// Syncing all the models at once.
conn.sync({ alter: true }).then(() => {
<<<<<<< HEAD
  //loadData(); //Ejecuta para agregar los roles a la DB
=======
  // loadData(); //Ejecuta para agregar los roles a la DB
>>>>>>> c0a9bc4ca83fafa0490aa67e24dadf13057bcf01
  server.listen(process.env.PORT || 3001, () => {
    console.log("listening at port " + process.env.PORT); // eslint-disable-line no-console
  });
});
