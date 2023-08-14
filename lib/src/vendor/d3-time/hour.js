import { timeInterval } from "./interval.js";
import { durationHour, durationMinute, durationSecond } from "./duration.js";
export var timeHour = timeInterval(function (date) {
  "worklet";

  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
}, function (date, step) {
  "worklet";

  date.setTime(+date + step * durationHour);
}, function (start, end) {
  "worklet";

  return (end - start) / durationHour;
}, function (date) {
  "worklet";

  return date.getHours();
});
export var timeHours = timeHour.range;
export var utcHour = timeInterval(function (date) {
  "worklet";

  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setTime(+date + step * durationHour);
}, function (start, end) {
  "worklet";

  return (end - start) / durationHour;
}, function (date) {
  "worklet";

  return date.getUTCHours();
});
export var utcHours = utcHour.range;