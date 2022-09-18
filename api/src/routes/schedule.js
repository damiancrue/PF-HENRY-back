const { Router } = require("express");
const { Schedule, Movie, Room } = require("../db.js");
const { Op, where } = require("sequelize");
const router = Router();
const {
  getSchedulesParametersHandler,
} = require("../controllers/getSchedulesParamatersHandler.js");

//todo
router.get("/getSchedules", async (req, res) => {
  const { movie_id, room_id, day, time_period, active } = req.query;

  var paramObj = {};
  getSchedulesParametersHandler(
    movie_id,
    room_id,
    day,
    time_period,
    active,
    paramObj
  );
  try {
    const schedules = await Schedule.findAll({
      where: {
        day: {
          [Op.between]: [paramObj.day_f, paramObj.day_t],
        },
        movie_id: {
          [Op.between]: [paramObj.movie_f, paramObj.movie_t],
        },
        room_id: {
          [Op.between]: [paramObj.room_f, paramObj.room_t],
        },
        time: {
          [Op.between]: [paramObj.time_period_f, paramObj.time_period_t],
        },
        [Op.or]: [
          { active: paramObj.active_true },
          { active: paramObj.active_false },
        ],
      },
      include: [
        {
          model: Movie,
          attributes: ["movie_id", "title", "poster", "display", "duration"],
        },
        {
          model: Room,
          attributes: ["room_id", "name", "display_type", "room_seats"],
        },
      ],
    });
    if (schedules.length === 0)
      return res
        .status(404)
        .send({ message: "No schedules found", paramObj: paramObj });
    return res.status(200).send([schedules, paramObj]);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ message: "ID must be informed" });
  try {
    const schedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Movie,
          attributes: ["movie_id", "title", "poster", "display", "duration"],
        },
        {
          model: Room,
          attributes: ["room_id", "name", "display_type", "room_seats"],
        },
      ],
    });
    if (schedule) return res.status(200).send(schedule);
    return res.status(404).send({ message: "No schedule found for given ID" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.put("/modifySchedule", async (req, res) => {
  const { schedule_id, day, time, active, movie_id, room_id } = req.body;
  try {
    await Schedule.update(
      {
        day: day,
        time: time,
        active: active,
        movie_id: movie_id,
        room_id: room_id,
      },
      {
        where: {
          schedule_id: schedule_id,
        },
      }
    );
    res.status(200).send({ message: "Schedule updated" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});
//!-----------------------------------------------------------
// router.put("/modifySeats", async (req, res, next) => {
//   if (!req.body) return res.send("The form is empty");
//   try {
//     const { schedule_id, key, value } = req.query;
//     const { day, time, active, movie_id, room_id } = req.body;
//     const schedule = await Schedule.findByPk(schedule_id, {
//       include: [
//         {
//           model: Room,
//           attributes: ["room_seats"],
//         },
//       ],
//     });
//     if (schedule) {
//       let seats = schedule.Room.room_seats;
//       if (seats.hasOwnProperty(key)) {
//         if (seats[key] === true) {
//           seats[key] = value === "true";
//         }
//       }
//       const seatAvailable = await schedule.update({
//         day,
//         time,
//         active,
//         movie_id,
//         room_id,
//       });

//       console.log(seatAvailable.toJSON());
//       return res.send(seatAvailable);
//     }
//     res.status(404).send("Schedule not found");
//   } catch (error) {
//     next(error);
//   }
// });
//!-----------------------------------------------------------

router.post("/createSchedule", async (req, res) => {
  const values = Object.values(req.body);
  try {
    if (values.includes("")) {
      return res.status(400).send({ message: "No field can be emtpy" });
    }
    if (values.length < 5) {
      return res.status(400).send({ message: "All data must be sent" });
    }
    const { day, time, active, movie_id, room_id } = req.body;
    const newSchedule = await Schedule.create({
      day,
      time,
      active,
      movie_id,
      room_id,
    });
    return res.status(201).send(newSchedule);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

router.delete("/deleteSchedule/:schedule_id", async (req, res) => {
  const { schedule_id } = req.params;
  try {
    await Schedule.update(
      { active: false },
      { where: { schedule_id: schedule_id } }
    );
    return res.status(200).send({ message: "Schedule deactivated" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});
//!-------------------------------------------------------------------------------------------------
router.put("/soldSeats/:schedule_id", async (req, res, next) => {
  const { schedule_id } = req.params;

  if (!req.body) res.send("The form is empty");

  try {
    const { sold } = req.body;
    const schedule = await Schedule.findByPk(schedule_id);
    if (schedule) {
      const aux = schedule.boughtSeats;

      function verifySeats(seats) {
        for (let i = 0; i < seats.length; i++) {
          if (aux.includes(seats[i])) {
            return false;
          }
        }
        return true;
      }

      if (verifySeats(sold)) {
        const soldSeats = await schedule.update({
          boughtSeats: [...aux, ...sold],
        });
        return res.send(soldSeats);
      }
      return res.status(400).send("Seats already sold");
    }
  } catch (e) {
    next(e);
  }
});

// router.put("/soldSeats", async (req, res) => {
//   if (!req.body) return res.send("The form is empty");
//   try {
//     const { schedule_id, sold } = req.body;

//     const schedule = await Schedule.findByPk(schedule_id, {
//       include: [
//         {
//           model: Movie,
//           attributes: ["movie_id", "title", "poster", "display", "duration"],
//         },
//         {
//           model: Room,
//           attributes: ["room_seats", "room_id"],
//         },
//       ],
//     });
//     if (schedule) {
//       let seats = schedule.Room.room_seats;
//       if (sold) {
//         sold.forEach((seat) => {
//         if (seats.hasOwnProperty(seat)) {
//           if (seats[seat] === true) {
//             seats[seat] = false;
//           }
//         }
//       });
//     }
//       const seatAvailable = await schedule.update({
//         boughtSeats: schedule.boughtSeats ? schedule.boughtSeats.concat(sold) : sold,
//         Room: { room_seats: seats },
//       });
//       console.log(seatAvailable.toJSON());
//       return res.send(seatAvailable);
//     }
//     return res.status(200).send({ message: "Bought seats updated" });
//   } catch (err) {
//     return res.status(500).send({ message: err.message });
//   }
// });

module.exports = router;
