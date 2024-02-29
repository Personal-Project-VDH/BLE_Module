import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import {getDateTimeCurrent} from './utils';
moment.locale('vi');

export class SEND_SMS {
  constructor() {
    this.infor_array = {};
    this.phone_array = [];
  }

  saveInformation(phone, slot) {
    this.obj =
      this.infor === undefined || this.infor.length === 0 ? {} : this.infor;
    this.obj_save = {
      [`${phone}`]: {
        slot: slot,
        active: getDateTimeCurrent(),
      },
    };

    this.infor = Object.assign(this.obj, this.obj_save);
    console.log(this.infor);
  }
  checkTimeActive() {
    this.temp_obj = object = {
      0: {active: '2024-02-24T10:50:42.516257', slot: 6},
      1: {active: '2024-02-24T10:50:34.516257', slot: 1},
      2: {active: '2024-02-24T10:50:33.516257', slot: 6},
      3: {active: '2024-02-24T10:50:43.516257', slot: 8},
      4: {active: '2024-02-24T10:50:36.516257', slot: 7},
      5: {active: '2024-02-24T10:50:47.516257', slot: 1},
      6: {active: '2024-02-24T10:50:38.516257', slot: 6},
      7: {active: '2024-02-24T10:50:46.516257', slot: 6},
      8: {active: '2024-02-24T10:50:45.516257', slot: 0},
      9: {active: '2024-02-24T10:50:44.516257', slot: 0},
    };

    this.temp_phone_array = [];

    for (const ele in this.temp_obj) {
      if (moment().diff(moment(this.temp_obj[ele].active), 'seconds') > 5) {
        console.log(this.temp_obj[ele], ' heet han');

        this.temp_phone_array.push(this.temp_obj[ele]);
      } else {
        console.log(this.temp_obj[ele], ' con han');
      }
    }

    this.phone_array = this.temp_phone_array;
  }
}
