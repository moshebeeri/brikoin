/**
 * Created by roilandshut on 30/08/2017.
 */
import moment from "moment";
const DateAtTime = "{0} at {1}";

String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function() {
    "use strict";
    let str = this.toString();
    if (arguments.length) {
      let t = typeof arguments[0];
      let key;
      let args =
        t === "string" || t === "number"
          ? Array.prototype.slice.call(arguments)
          : arguments[0];
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

class DateUtils {
  messageFormater(itemDate) {
    let date = new Date(itemDate);
    let currentYear = new Date().getYear();
    let year = date.getYear();
    if (this.isToday(date)) {
      return moment(date).format("HH:mm");
    }
    if (this.isThisWeek(date)) {
      return DateAtTime.formatUnicorn(
        this.localize(moment(date).format("dddd"), moment(date).format("dddd")),
        moment(date).format("HH:mm")
      );
    }
    if (currentYear === year) {
      return DateAtTime.formatUnicorn(
        this.localize(
          moment(date).format("MMMM"),
          moment(date).format("DD MMMM")
        ),
        moment(date).format("HH:mm")
      );
    }
    return DateAtTime.formatUnicorn(
      this.localize(
        moment(date).format("MMMM"),
        moment(date).format("DD MMMM YYYY")
      ),
      moment(date).format("HH:mm")
    );
  }
  dateFormater(itemDate) {
    let date = new Date(itemDate);

    return moment(date).format("DD/MM/YYYY");
  }

  localize(string, toLocale) {
    return string;
    // switch (string) {
    //   case 'Sunday':
    //     return toLocale.replace(string, strings.Sunday)
    //   case 'Monday':
    //     return toLocale.replace(string, strings.Monday)
    //   case 'Tuesday':
    //     return toLocale.replace(string, strings.Tuesday)
    //   case 'Wednesday':
    //     return toLocale.replace(string, strings.Wednesday)
    //   case 'Thursday':
    //     return toLocale.replace(string, strings.Thursday)
    //   case 'Friday':
    //     return toLocale.replace(string, strings.Friday)
    //   case 'Saturday':
    //     return toLocale.replace(string, strings.Friday)
    //   case 'January':
    //     return toLocale.replace(string, strings.January)
    //   case 'February':
    //     return toLocale.replace(string, strings.February)
    //   case 'March':
    //     return toLocale.replace(string, strings.March)
    //   case 'April':
    //     return toLocale.replace(string, strings.April)
    //   case 'May':
    //     return toLocale.replace(string, strings.May)
    //   case 'June':
    //     return toLocale.replace(string, strings.June)
    //   case 'July':
    //     return toLocale.replace(string, strings.July)
    //   case 'August':
    //     return toLocale.replace(string, strings.August)
    //   case 'September':
    //     return toLocale.replace(string, strings.September)
    //   case 'October':
    //     return toLocale.replace(string, strings.October)
    //   case 'November':
    //     return toLocale.replace(string, strings.November)
    //   case 'December':
    //     return toLocale.replace(string, strings.December)
    // }
    // return toLocale
  }

  isToday(itemDate) {
    return moment(itemDate).isSame(moment(), "day");
  }

  moreThenMiniute(lastTime) {
    return new Date().getTime() - lastTime > 60000;
  }

  isThisWeek(date) {
    var now = moment();
    var input = moment(date);
    return now.isoWeek() === input.isoWeek();
  }
}

const dateUtils = new DateUtils();

export default dateUtils;
