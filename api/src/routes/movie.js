const { Router } = require("express");
const { getMovies } = require("../controllers/getMovies");
const { getMoviesByName } = require("../controllers/getMoviesByName");
const { getMoviesById } = require("../controllers/getMoviesById");
const { deleteMovies } = require("../controllers/deleteMovies");
const { postMovies } = require("../controllers/postMovies");
const { putMovies } = require("../controllers/putMovies");
const { activateMovies } = require("../controllers/activateMovies");
const router = Router();

router.get("/", async (req, res, next) => {
  const { name } = req.query;

  if (name) {
    try {
      const movies = await getMoviesByName(name);
      if (movies.length > 0) {
        res.json(movies);
      } else {
        res.send("Movie not found");
      }
    } catch (e) {
      next(e);
    }
  } else {
    try {
      const movies = await getMovies();
      res.json(movies);
    } catch (e) {
      next(e);
    }
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const movie = await getMoviesById(id);
    if (movie) {
      res.json(movie);
    } else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }
});

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const movie = await postMovies(req.body);
    res.json(movie);
  } catch (e) {
    next(e);
  }
});

router.put("/update/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) res.send("The form is empty");

  try {
    const movie = await putMovies(id, req.body);
    if (movie) res.json(movie);
    else res.send("No matches were found");
  } catch (e) {
    next(e);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await deleteMovies(id);
    if (result) res.json(result);
    else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }
});

router.put("/activate/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await activateMovies(id);
    if (result) res.json(result);
    else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
