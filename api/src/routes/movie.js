const { Router } = require("express");
const { getMovies } = require("../controllers/getMovies");
const { getMoviesByName } = require("../controllers/getMoviesByName");
const { getMoviesById } = require("../controllers/getMoviesById");
const {
  getMoviesByParameter,
} = require("../controllers/getMoviesByparameter.js");
const { deleteMovies } = require("../controllers/deleteMovies");
const { postMovies } = require("../controllers/postMovies");
const { putMovies } = require("../controllers/putMovies");
const { activateMovies } = require("../controllers/activateMovies");
const router = Router();

router.get("/", async (req, res, next) => {
  const { name, active } = req.query;

  try {
    const movies = await getMoviesByParameter(name, active);
    if (movies.length > 0) {
      res.status(200).send(movies);
    } else {
      res.status(404).send({ message: "No movies found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }

  // if (name) {
  //   try {
  //     const movies = await getMoviesByName(name, active);
  //     if (movies.length > 0) {
  //       res.json(movies);
  //     } else {
  //       res.send("Movie not found");
  //     }
  //   } catch (e) {
  //     next(e);
  //   }
  // } else {
  //   try {
  //     const movies = await getMovies();
  //     res.json(movies);
  //   } catch (e) {
  //     next(e);
  //   }
  // }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const movie = await getMoviesById(id);
    if (movie) {
      res.status(200).send(movie);
    } else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
  }
});

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const movie = await postMovies(req.body);
    res.status(201).send(movie);
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
  }
});

router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) res.send("The form is empty");

  try {
    const movie = await putMovies(id, req.body);
    if (movie) res.status(200).send(movie);
    else res.status(404).send("No matches were found");
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await deleteMovies(id);
    if (result) res.status(200).send(result);
    else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status({ message: e.message });
    //next(e);
  }
});

router.put("/activate/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await activateMovies(id);
    if (result) res.status(200).send(result);
    else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
    //next(e);
  }
});

module.exports = router;
