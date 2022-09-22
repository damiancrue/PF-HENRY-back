const purchaseCleaner = async () => {
  const week = ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"];
  setInterval(() => {
    let yesterday = false;
    let splittedDate = new Date(Date.now()).toString().split(" ");
    let day = splittedDate[0];
    let dayNumber = parseInt(splittedDate[2]);
    let month = splittedDate[1];
    let year = splittedDate[3];
    let time = splittedDate[4].split(":").map((fraction) => parseInt(fraction));
    //Control de horas y minutos
    if (time[1] < 10) {
      //si los minutos son menores a 10
      if (time[0] === 0) {
        //si son las 24:XX
        time[0] = 23; //me muevo a las 23:XX
        yesterday = true;
      } else {
        time[0] -= 1; //sino resto 1 a la hora
        if (time[0] < 10) {
          console.log("entro a este if");
          //si la hora tiene un solo digito
          time[0] = `0${time[0]}`; //le agrego un 0 adelante
        } else {
          time[0] = time[0].toString(); //sino la convierto a string directamente
        }
      }
      let toSubstract = 10 - time[1]; //Me quedo con el resto
      time[1] = (60 - toSubstract).toString(); //y seteo los nuevos minutos y lo hago string
    } else {
      //si los minutos NO son menores a 10
      //checkeo y convierto la hora
      if (time[0] < 10) {
        time[0] = `0${time[0]}`;
      } else {
        time[0] = time[0].toString();
      }
      //checkeo y convierto los segundos
      if (time[2] < 10) {
        time[2] = `0${time[2]}`;
      } else {
        time[2] = time[2].toString();
      }
      if (time[1] - 10 < 10) {
        //si los minutos - 10 entra en minutos de 1 digito
        time[1] = `0${time[1] - 10}`; //seteo los minutos nuevos y los convierto a string
      } else {
        time[1] -= 10; // atraso 10 minutos la hora
        time[1] = time[1].toString(); //y lo convierto a string
      }
    }

    //Control de dias
    if (yesterday) {
      //test - NO negar
      let index = week.findIndex((weekDay) => weekDay === day);
      if (index === 0) {
        day = week[week.length - 1];
      } else {
        day = week[index - 1];
      }
      console.log(index);
    }

    //control de dias (fecha)
    if (yesterday) {
      if (dayNumber === 1) {
      }
    }
  }, 2000);
};

module.exports = purchaseCleaner;
