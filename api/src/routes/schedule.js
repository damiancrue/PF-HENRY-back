const { Router } = require("express");
const { Schedule, Movie, Room } = require("../db.js");
const { Op } = require("sequelize");
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
        { model: Room, attributes: ["room_id", "name", "display_type"] },
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
    const schedule = await Schedule.findByPk(id);
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
