const { Router } = require("express");
const { Schedule } = require("../db.js");
const router = Router();

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

module.exports = router;
