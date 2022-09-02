const { Router } = require('express');
const { getRoom } = require('../controllers/getRoom');
const { getRoomByName } = require('../controllers/getRoomByName');
const { postRoom } = require('../controllers/postRoom');
const { putRooms } = require('../controllers/putRoom');
const router = Router();

router.get('/', async (req, res, next) => {
   const { name } = req.query;
   if (name) {
      try {
         const rooms = await getRoomByName(name);
         if (rooms.length > 0) return res.send(rooms);
         else return res.send("Room not found")
      } catch (error) {
         next(error)
      }
   } else {
      try {
         const rooms = await getRoom();
         return res.json(rooms)
      } catch (error) {
         next(error)
      }
   }

})

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
      const room = await putRooms(id, req.body);
      if (room) return res.send(room)
      else return res.send("No matches were found")
   } catch (error) {
      next(e);
   }
});


module.exports = router;