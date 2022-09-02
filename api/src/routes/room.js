const { Router } = require('express');
const { getRoom } = require('../controllers/getRoom');
const { postRoom } = require('../controllers/postRoom');
const { putMovies } = require('../controllers/putMovies');
const router = Router();

router.get('/:displayMovie', async (req, res, next) => {
   try {
      const getRooms = await getRoom();
      const { displayMovie } = req.params
      const arrMovies = []
      getRooms.forEach(element => {
         if (element.display.includes(displayMovie.toUpperCase())) {
            arrMovies.push(element)
         }
      });
      res.send(arrMovies)
   } catch (error) {
      next(error)
   }
});

router.post('/create', async (req, res, next) => {
   if (!req.body) res.send("The form is empty");
   try {
      const room = await postRoom(req.body);
      res.json(room);
   } catch (error) {
      next(error);
   }
});

router.put('/update/:id', async (req, res, next) => {
   const { id } = req.params;
   if (!req.body) return res.send("The form is empty");
   try {
      const room = await putMovies(id, req.body);
      if (room) return res.send(room)
      else return res.send("No matches were found")
   } catch (error) {
      next(e);
   }
});


module.exports = router;