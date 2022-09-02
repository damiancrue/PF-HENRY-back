const { DataTypes } = require("sequelize");

// Table cine.movies{
//   movie_id int [pk, increment]
//   title varchar
//   description varchar
//   poster varchar
//   duration int
//   classification varchar
//   cast schema
//   director varchar
//   writter varchar
//   language varchar
//   display_id int [ref: <> cine.displays.description] <--- lo vemos en las relaciones
// }

module.exports = (sequelize) => {
  sequelize.define("Movie", {
    movie_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false, // Se eliminaron las lineas de allowNull: true porque es el valor por defecto
    },
    description: {
      type: DataTypes.TEXT,
    },
    poster: {
      type: DataTypes.STRING,
      validate: {
        // asi no hay que cargar el elemento en ninguna parte, solo se llama de otro sitio
        isUrl: true,
      },
    },
    image_1: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    image_2: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    teaser: {
      type: DataTypes.STRING,
      validate: {
        // asi no hay que cargar el elemento en ninguna parte, solo se llama de otro sitio
        isUrl: true,
      },
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    display: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    classification: {
      type: DataTypes.STRING,
    },
    cast: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    director: {
      type: DataTypes.STRING,
    },
    writter: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    comingSoon: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  });
};
