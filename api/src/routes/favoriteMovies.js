const { Router } = require("express");
const { User } = require("../db");

const router = Router();

//!---------------------------------------------------
router.put('/userFavs/:user_id', async (req, res, next) => {
   const { user_id } = req.params;
   const { movie_id, val } = req.body;
   try {
      if (!user_id) return res.send("user_id must be sent");
      const user = await User.findByPk(user_id)
      if (user) {
         const aux = user.favMovieId
         if (val) {
            if (!aux.includes(movie_id)) {
               const favMovie = await user.update({
                  favMovieId: [...aux, movie_id]
               });
               return res.send(favMovie)
            } else {
               const favMovie = await user.update({
                  favMovieId: [...aux]
               });
               return res.send(favMovie)
            }
         } else {
            if (aux.includes(movie_id)) {
               const favMovie = await user.update({
                  favMovieId: aux.filter(e => e !== movie_id)
               });
               return res.send(favMovie);
            } else {
               const favMovie = await user.update({
                  favMovieId: [...aux]
               });
               return res.send(favMovie)
            }
         }
      }
   } catch (error) {
      next(error)
   }
})
//!---------------------------------------------------

router.get('/getFav/:user_id', async (req, res, next) => {
   const { user_id } = req.params;
   try {
      if (!user_id) return res.send("user_id must be sent");
      const userFavMovies = await User.findByPk(
         user_id,
         { attributes: ['favMovieId'] }
      )
      res.send(userFavMovies)
   } catch (error) {
      next(error)
   }

});

module.exports = router;
