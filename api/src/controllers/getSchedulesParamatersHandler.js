const highNumber = 1000000;

const getSchedulesParametersHandler = (
  movie,
  room,
  day,
  time_period,
  active,
  paramObj
) => {
  paramObj.movie_f = movie ? movie : 0;
  paramObj.movie_t = movie ? movie : highNumber;
  paramObj.room_f = room ? room : 0;
  paramObj.room_t = room ? room : highNumber;
  paramObj.day_f =
    day?.split("_")[0] !== "null" && day?.split("_")[0] !== undefined
      ? new Date(day.split("_")[0] + "T03:00:00.000Z").toISOString()
      : new Date("1000-01-01").toISOString();
  paramObj.day_t =
    day?.split("_")[1] !== "null" && day?.split("_")[1] !== undefined
      ? new Date(day.split("_")[1] + "T03:00:00.000Z").toISOString()
      : new Date("9999-01-01").toISOString();
  paramObj.time_period_f =
    time_period?.split("_")[0] !== "null" &&
    time_period?.split("_")[0] !== undefined
      ? time_period.split("_")[0]
      : "00:00";
  paramObj.time_period_t =
    time_period?.split("_")[1] !== "null" &&
    time_period?.split("_")[1] !== undefined
      ? time_period.split("_")[1]
      : "23:59";
  paramObj.active_true = active ? active : true;
  paramObj.active_false = active ? active : false;
};
module.exports = {
  getSchedulesParametersHandler,
};
