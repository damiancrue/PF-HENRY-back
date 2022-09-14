const { User, Room, Product, Movie } = require("../db.js");
const { sala200 } = require("../data/seats.js");
const { getMovies } = require("../controllers/getMovies.js");
const firebase = require("../firebase-config.js");

//firebase.auth().deleteUser();
const loadData = async () => {
  // await User.bulkCreate([
  //   {
  //     user_id: "XYlzBbLtYyXe22YeKmI6bGa70AB2",
  //     name: "Alan",
  //     email: "alan@alan.com",
  //     role_id: "A",
  //     active: true,
  //   },
  //   {
  //     user_id: "U95CjeGaxaNiHToT7CjGeCkfWg72",
  //     name: "Nico",
  //     email: "nico@nico.com",
  //     role_id: "A",
  //     active: true,
  //   },
  //   {
  //     user_id: "F1hzz5dKfOX3XXABJ3DZHNAooii1",
  //     name: "Dami",
  //     email: "dami@dami.com",
  //     role_id: "A",
  //     active: true,
  //   },
  //   {
  //     user_id: "TjxZZgCuI7TopnsH5AgYmhTQXWz2",
  //     name: "Luis",
  //     email: "luis@luis.com",
  //     role_id: "A",
  //     active: true,
  //   },
  //   {
  //     user_id: "32KaZH6OZeYbWGl9sukzV9RjiY72",
  //     name: "Samu",
  //     email: "samu@samu.com",
  //     role_id: "A",
  //     active: true,
  //   },
  //   {
  //     user_id: "f7NG3jcYZ5QWtJcfL1pbhY7U2Cd2",
  //     name: "Ernesto",
  //     email: "ernest@ernest.com",
  //     role_id: "A",
  //     active: true,
  //   },
  //   {
  //     user_id: "l1yjsoEZrNhjxOHW8Hh7Jp1NMu83",
  //     name: "Machu",
  //     email: "machu@machu.com",
  //     role_id: "A",
  //     active: true,
  //   },
  // ]);
  await Room.bulkCreate([
    { name: "Sala 1", room_seats: sala200, display_type: "2D" },
    { name: "Sala 2", room_seats: sala200, display_type: "3D" },
    { name: "Sala 3", room_seats: sala200, display_type: "4D" },
    { name: "Sala 4", room_seats: sala200, display_type: "Premium" },
  ]);
  await Product.bulkCreate([
    {
      name: "Producto 1",
      stock: 100,
      price: 104.2,
      image: "https://pbs.twimg.com/media/CIeiH0pWgAAFhuJ.jpg",
    },
    {
      name: "Producto 2",
      stock: 90,
      price: 50.35,
      image: "https://pbs.twimg.com/media/CIeiH0pWgAAFhuJ.jpg",
    },
    {
      name: "Producto 3",
      stock: 85,
      price: 20.0,
      image: "https://pbs.twimg.com/media/CIeiH0pWgAAFhuJ.jpg",
    },
    {
      name: "Producto 4",
      stock: 120,
      price: 98.75,
      image: "https://pbs.twimg.com/media/CIeiH0pWgAAFhuJ.jpg",
    },
  ]);
  await Movie.bulkCreate([
    {
      title: "30 noches con mi ex",
      description:
        "El Turbo, luego de años de separado de La Loba, acepta por pedido de la hija que tienen en común, convivir durante treinta días con su exmujer, quien viene de una larga internación psiquiátrica.",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNmVlZDU1MGItZTE0NC00MzNjLTk1Y2MtNzIyODI5ODQ4NjJmXkEyXkFqcGdeQXVyMTIyNDMyODEx._V1_.jpg",
      image_1: "https://m.cinesargentinos.com.ar/static/archivos/67154",
      image_2:
        "https://cdn.eltrecetv.com.ar/sites/default/files/styles/934x525/public/2022/08/04/suar_pilar_gamboa.jpg",
      teaser: "https://youtu.be/IKRwXsCUjfI",
      genre: ["Comedy", "Romance"],
      display: ["2D"],
      duration: 95,
      classification: "+16",
      cast: ["Adrian Suar", "Pilar Gamboa"],
      director: "Adrian Suar",
      writter: "Adrian Suar",
      language: ["Spanish"],
      comingSoon: false,
      active: true,
    },
    {
      title: "Paws of fury: The legend of Hank",
      description:
        "A hard-on-his-luck hound Hank (Michael Cera) finds himself in a town full of cats who need a hero to defend them from a ruthless villain's (Ricky Gervais) evil plot to wipe their village off the map. With help from a reluctant teacher (Samuel L. Jackson) to train him, our underdog must assume the role of town samurai and team up with the villagers to save the day. The only problem... cats hate dogs.",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNjJlNDA5ODQtZWJlNy00NWU2LTkyMWItZWY5NzZlMTlmMWFhXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg",
      image_1:
        "https://m.media-amazon.com/images/M/MV5BZDVjOGRkZTEtZGM5Mi00MWExLTkyZjgtNjE1ZmRmODc1NTljXkEyXkFqcGdeQXVyNTQwOTcxOTg@._V1_.jpg",
      image_2:
        "https://m.media-amazon.com/images/M/MV5BNzk3NGM5NzktN2FlMy00NjMyLWFmYjUtMDcxY2QzMjQ1ZWM0XkEyXkFqcGdeQXVyNTQwOTcxOTg@._V1_.jpg",
      teaser: "https://youtu.be/A_hkjvjx2ek",
      genre: ["Animation", "Action", "Comedy"],
      display: ["2D"],
      duration: 98,
      classification: "ATP",
      cast: ["Michael Cera", "Samuel L. Jackson", "Ricky Gervais"],
      director: "Chris Bailey",
      writter: "Ed Stone",
      language: ["English"],
      comingSoon: false,
      active: true,
    },
    {
      title: "Thor: Love and Thunder",
      description:
        "Thor's retirement is interrupted by a galactic killer known as Gorr the God Butcher, who seeks the extinction of the gods. To combat the threat, Thor enlists the help of King Valkyrie, Korg and ex-girlfriend Jane Foster, who - to Thor's surprise - inexplicably wields his magical hammer, Mjolnir, as the Mighty Thor. Together, they embark upon a harrowing cosmic adventure to uncover the mystery of the God Butcher's vengeance and stop him before it's too late.",
      poster:
        "https://m.media-amazon.com/images/M/MV5BYmMxZWRiMTgtZjM0Ny00NDQxLWIxYWQtZDdlNDNkOTEzYTdlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      image_1:
        "https://m.media-amazon.com/images/M/MV5BMDFlN2E5ODEtM2U4YS00YzBmLTlkYjItNjJmNzYyM2QxMTYxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
      image_2:
        "https://m.media-amazon.com/images/M/MV5BYjgxMTliN2ItN2RjMy00YWUxLWE0MzUtMDdkYzI2MGM0M2YzXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      teaser: "https://youtu.be/Go8nTmfrQd8",
      genre: ["Action", "Adventure", "Comedy"],
      display: ["2D"],
      duration: 150,
      classification: "+13",
      cast: [
        "Chris Hemsworth",
        "Natalie Portman",
        "Christian Bale",
        "Russel Crowe",
      ],
      director: "Taika Waititi",
      writter: "Taika Waititi",
      language: ["Ingles"],
      comingSoon: false,
      active: true,
    },
    {
      title: "The Jack in the Box: Awakening",
      description:
        "When a vintage Jack-in-the-box is opened by a dying woman, she enters into a deal with the demon within that would see her illness cured in return for helping it claim six innocent victims.",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNzA0YzhmZDktOGMxMy00YmUxLWE1YmUtZTZhOWQyMzI1OTA2XkEyXkFqcGdeQXVyNzU4NzMwMjI@._V1_.jpg",
      image_1:
        "https://m.media-amazon.com/images/M/MV5BMDY1NzZkNGMtODIwYS00ODJlLTgzZTgtOTdkNDNhNjVhYTIyXkEyXkFqcGdeQXVyNDgyNzAxMzY@._V1_.jpg",
      image_2:
        "https://m.media-amazon.com/images/M/MV5BNzAzYWJkNzEtZmE1MC00MDMyLTlkYWUtMTE4MzQ2N2UwZDQ4XkEyXkFqcGdeQXVyNDgyNzAxMzY@._V1_.jpg",
      teaser: "https://youtu.be/uCvoIK2xqdw",
      genre: ["Horror"],
      display: ["3D"],
      duration: 93,
      classification: "+18",
      cast: ["Matt McClure", "James Swanton", "Mollie Hindle"],
      director: "Lawrence Folder",
      writter: "Lawrence Folder",
      language: ["Ingles"],
      comingSoon: true,
      active: true,
    },
    {
      title: "The Black Phone",
      description:
        "Finney Blake is a shy but clever 13-year-old boy who is abducted by a sadistic killer and trapped in a soundproof basement where screaming is of no use. When a disconnected phone on the wall begins to ring, Finney discovers that he can hear the voices of the killer's previous victims. And they are dead-set on making sure that what happened to them doesn't happen to Finney. ",
      poster:
        "https://m.media-amazon.com/images/M/MV5BOWVmNTBiYTUtZWQ3Yi00ZDlhLTgyYjUtNzBhZjM3YjRiNGRkXkEyXkFqcGdeQXVyNzYyOTM1ODI@._V1_.jpg",
      image_1:
        "https://m.media-amazon.com/images/M/MV5BNzJkYmQ2NDEtN2RhOC00ZTBlLWJkZDUtYjhmYzk5OTNkMzJlXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      image_2:
        "https://m.media-amazon.com/images/M/MV5BNWI3NzY5YTAtOTMxMy00M2MyLTg1YTMtOTAxODNlYjI2ZWJlXkEyXkFqcGdeQXVyOTc5MDI5NjE@._V1_.jpg",
      teaser: "https://youtu.be/XhcEnHDKHco",
      genre: ["Horror"],
      display: ["4DX"],
      duration: 104,
      classification: "+18",
      cast: ["Ethan Hawke", "Jeremy Davies", "Mason Thames"],
      director: "Scott Derrickson",
      writter: "Scott Derrickson",
      language: ["Ingles"],
      comingSoon: false,
      active: true,
    },
    {
      title: "Where the Crawdads Sing",
      description:
        'Abandoned by her family, Kya Clark, otherwise known to the townspeople of Barkley Cove as the Marsh Girl, is mysterious and wild. "Where the Crawdads Sing" is a coming-of-age story of a young girl raised by the marshlands of the south in the 1950s. When the town hotshot is found dead, and inexplicably linked to Kya, the Marsh Girl is the prime suspect in his murder case.',
      poster:
        "https://m.media-amazon.com/images/M/MV5BMTJmNGJmYTgtYjAxNy00YmMzLTk2YTYtMGIzMmUwNDMyMTY1XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
      image_1:
        "https://m.media-amazon.com/images/M/MV5BYjQ4NjIzMWItNzQwMy00Mjc3LTk1YTMtYzQ1MzdmOGRkNTdhXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      image_2:
        "https://m.media-amazon.com/images/M/MV5BNDY3M2M0NjYtOWRhZC00ZTgyLTkwNDgtYWE1NWExYjVhNzBhXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      teaser: "https://youtu.be/PY3808Iq0Tg",
      genre: ["Thriller"],
      display: ["IMAX"],
      duration: 125,
      classification: "+18",
      cast: ["Daisy Edgar Jones", "Taylor John Smith"],
      director: "Olivia Newman",
      writter: "Olivia Newman",
      language: ["Ingles"],
      comingSoon: true,
      active: true,
    },
  ]);
};

module.exports = loadData;
