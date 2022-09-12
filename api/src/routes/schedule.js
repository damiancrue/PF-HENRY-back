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
        { model: Room, attributes: ["room_id", "name", "display_type", "room_seats"] },
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

router.put("/modifySeats/:schedule_id", async (req, res, next) => {
  const { schedule_id } = req.params;
  const { key } = req.query
  if (!schedule_id) res.send("schedule_id must be sent")
  try {
    const schedule = await Schedule.findByPk(schedule_id, {
      include: [{
        model: Room,
        attributes: ["room_seats"]
      }]
    });
    //console.log(schedule.toJSON())
    if (schedule) {
      let seats = schedule.Room.room_seats;
      //console.log(seats[key])
      const updated = await schedule.update(
        {
          [Room.room_seats[key]]: seats[key] = !seats[key]
        },
        {
          where: { schedule_id }
        }
      )
      console.log(updated.toJSON())
      res.send(updated)
    }
  } catch (error) {
    next(error)
  }
})
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

router.delete("/deleteSchedule", async (req, res) => {
  const { schedule_id } = req.body;
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

module.exports = router;







/* router.put("/modifySeats/:schedule_id", async (req, res, next) => {

  try {
    const { key } = req.query;
    const { schedule_id } = req.params;
    if (!schedule_id) res.send("The ID must be sent")
    const schedule = await Schedule.findByPk(schedule_id, {
      include: [
        {
          model: Room,
          attributes: ["room_seats"],
        },
      ]
    });
    //console.log(schedule.Room.room_seats)
    if (schedule) {
      let seats = schedule.Room.room_seats
      //console.log(key)
      //console.log(seats)
      const seatUpdated = await schedule.update({
        [Room.room_seats]: seats[key] = !seats[key]
      }, { where: schedule_id })
      //console.log(seatUpdated.toJSON())

      //console.log(schedule.toJSON())
      return res.send(seatUpdated)
    } else {
      res.status(404).send("Schedule not found")
    }
  } catch (error) {
    next(error)
  }
}); */
/* router.put("/modifySeats/:schedule_id", async (req, res, next) => {
  if (!req.body) return res.send("The form is empty")
  try {
    const { schedule_id } = req.params;
    const { key, value } = req.body;
    //const { day, time, active, movie_id, room_id } = req.body;
    const schedule = await Schedule.findByPk(schedule_id, {
      include: [
        {
          model: Room,
          attributes: ["room_seats"],
        },
      ]
    });
    if (schedule) {
      let seats = schedule.Room.room_seats
      //console.log('seats: ', seats)

      //if (seats[key] === true) {
      //seats[key] = value === 'true'
      const updated = await schedule.set(

        {
          [Room.room_seats]: [seats[key] = !value]
        },
        {
          where: {
            schedule_id
          }
        }

      );
      console.log(updated.toJSON())
      return res.send(updated)
      //}

    } else {
      res.status(404).send("Schedule not found")
    }
  } catch (error) {
    next(error)
  }
}); */