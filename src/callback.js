export const cbObj = {};

export const runCallback = (key, value) => {
  try {
    cbObj.callback[key](value);
  } catch (error) {
    console.log(error);
  }
};

export const assignCallback = (...data) => {
  for (let i = 0; i < data.length; i++) {
    let init = cbObj.callback === undefined ? {} : cbObj.callback;
    cbObj.callback = Object.assign(init, data[i]);
  }
  // console.log(cbObj.callback);
};
