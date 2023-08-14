import { timeInterval } from "./interval.js";
import { durationMinute, durationWeek } from "./duration.js";
function timeWeekday(i) {
  "worklet";

  return timeInterval(function (date) {
    "worklet";

    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    "worklet";

    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    "worklet";

    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}
export var timeSunday = timeWeekday(0);
export var timeMonday = timeWeekday(1);
export var timeTuesday = timeWeekday(2);
export var timeWednesday = timeWeekday(3);
export var timeThursday = timeWeekday(4);
export var timeFriday = timeWeekday(5);
export var timeSaturday = timeWeekday(6);
export var timeSundays = timeSunday.range;
export var timeMondays = timeMonday.range;
export var timeTuesdays = timeTuesday.range;
export var timeWednesdays = timeWednesday.range;
export var timeThursdays = timeThursday.range;
export var timeFridays = timeFriday.range;
export var timeSaturdays = timeSaturday.range;
function utcWeekday(i) {
  "worklet";

  return timeInterval(function (date) {
    "worklet";

    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    "worklet";

    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function (start, end) {
    "worklet";

    return (end - start) / durationWeek;
  });
}
export var utcSunday = utcWeekday(0);
export var utcMonday = utcWeekday(1);
export var utcTuesday = utcWeekday(2);
export var utcWednesday = utcWeekday(3);
export var utcThursday = utcWeekday(4);
export var utcFriday = utcWeekday(5);
export var utcSaturday = utcWeekday(6);
export var utcSundays = utcSunday.range;
export var utcMondays = utcMonday.range;
export var utcTuesdays = utcTuesday.range;
export var utcWednesdays = utcWednesday.range;
export var utcThursdays = utcThursday.range;
export var utcFridays = utcFriday.range;
export var utcSaturdays = utcSaturday.range;