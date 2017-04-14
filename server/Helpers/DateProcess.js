import Moment from 'moment';

class DateProcess {

  constructor(date) {
    this.date = date;
  }

  static _getRelativeDate(momentObj) {
    return momentObj.fromNow();
  }

  static _getFormatedDate(momentObj, format) {
    return momentObj.format(format);
  }

  getDate() {
    const dateNow = Moment(new Date());
    const dateComp = Moment(this.date);
    if (dateNow.diff(dateComp, 'days') < 1) {
      this.date = DateProcess._getRelativeDate(dateComp);
    } else {
      this.date = DateProcess._getFormatedDate(dateComp, 'DD/MM/YY');
    }
    return this.date;
  }
}

export default DateProcess;
