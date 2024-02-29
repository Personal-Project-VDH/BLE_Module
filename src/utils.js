export const getDateTimeCurrent = () => {
  var today = new Date();
  let day;
  let month;
  if (today.getMonth() < 10) {
    month = '0' + (today.getMonth() + 1);
  } else {
    month = today.getMonth() + 1;
  }
  if (today.getDate() < 10) {
    day = '0' + today.getDate();
  } else {
    day = today.getDate();
  }
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  let hours = '';
  let minutes = '';
  let seconds = '';
  if (h < 10) {
    hours = '0' + String(h);
  } else {
    hours = String(h);
  }
  if (m < 10) {
    minutes = '0' + String(m);
  } else {
    minutes = String(m);
  }
  if (s < 10) {
    seconds = '0' + String(s);
  } else {
    seconds = String(s);
  }
  var date =
    today.getFullYear() +
    '-' +
    month +
    '-' +
    day +
    `T${hours}:${minutes}:${seconds}.516257`;
  return date;
};

export const consoleDebug = (...data) => {
  console.debug(data);
};
