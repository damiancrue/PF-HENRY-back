const { Router } = require("express");
const { User } = require("../db");

const router = Router();


router.post('/addFav/:user_id', async (req, res, next) => {
   const { user_id } = req.params;
   const { fav } = req.body;  //*movie_id
   try {
      if (!user_id) return res.send("user_id must be sent");
      const user = await User.findByPk(user_id);
      if (user) {
         const aux = user.favMovieId
         console.log(aux)
         for (let i = 0; i < aux.length; i++) {
            if (!aux.includes(fav)) return aux.push(fav)
         }
         const favMovie = await user.update(
            { favMovieId: aux },
            { where: { user_id } }
         )
         res.send(favMovie)
      } else {
         res.status(404).send("User not found")
      }
   } catch (error) {
      next(error)
   }
});

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

})

router.delete("/deleteFav/:user_id", async (req, res, next) => {
   const { user_id } = req.params;
   const { fav } = req.body;
   try {
      const user = await User.findByPk(user_id)
      if (!user_id) return res.send("user_id must be sent");
      const aux = user.favMovieId.filter(e => e !== fav)
      const favMovie = await user.update(
         { favMovieId: aux },
         { where: { user_id } }
      )
      res.send(favMovie)
   } catch (error) {
      next(error)
   }
})

module.exports = router;
