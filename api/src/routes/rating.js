const { Router } = require("express");
const { Rating, Movie, User } = require("../db.js");
const router = Router();

router.get("/", async (req, res, next) => {
  const { rating_id } = req.query;

  if (rating_id) {
    try {
      const rating = await Rating.findByPk(rating_id, {
        include: [
          {
            model: Movie,
            attributes: [
              "movie_id",
              "title",
              "poster",
              "genre",
              "display",
              "language",
            ],
          },
          {
            model: User,
            attributes: ["user_id", "name"],
          },
        ],
      });
      if (rating) {
        res.json(rating);
      } else {
        res.send("No matches were found");
      }
    } catch (e) {
      next(e);
    }
  } else {
    try {
      const ratings = await Rating.findAll({
        include: [
          {
            model: Movie,
            attributes: [
              "movie_id",
              "title",
              "poster",
              "genre",
              "display",
              "language",
            ],
          },
          {
            model: User,
            attributes: ["user_id", "name"],
          },
        ],
      });
      res.json(ratings);
    } catch (e) {
      next(e);
    }
  }
});

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const { rate, review, movie_id, user_id } = req.body;

    const rating = await Rating.create({
      rate: parseInt(rate),
      review,
      movie_id: parseInt(movie_id),
      user_id,
    });

    res.json(rating);
  } catch (e) {
    next(e);
  }
});

router.put("/update/:rating_id", async (req, res, next) => {
  const { rating_id } = req.params;

  if (!req.body) res.send("The form is empty");

  try {
    const { movie_id, user_id, rate, review } = req.body;
    const rating = await Rating.findByPk(parseInt(rating_id));
    if (rating) {
      await rating.update({
        rate: parseInt(rate),
        review,
        movie_id: parseInt(movie_id),
        user_id,
      });
      res.json(rating);
    } else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/delete/:rating_id", async (req, res, next) => {
  const { rating_id } = req.params;

  try {
    const rating = await Rating.findByPk(parseInt(rating_id));
    if (rating) {
      await rating.destroy();
      res.send("Rating deleted");
    } else {
      res.send("No matches were found");
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
