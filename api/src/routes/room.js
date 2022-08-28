const { Router } = require('express');
const { getRoom } = require('../controllers/getRoom');
const router = Router();

router.get('/:displayMovie', async (req, res, next) => {
   try {
      const getRooms = await getRoom();
      const { displayMovie } = req.params
      const arrMovies = []
      getRooms.forEach(element => {
         if (element.display.includes(displayMovie)) {
            arrMovies.push(element)
         }
      });
      res.send(arrMovies)
   } catch (error) {
      next(error)
   }
});

module.exports = router;