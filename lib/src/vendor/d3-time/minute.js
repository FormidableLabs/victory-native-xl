import { timeInterval } from "./interval.js";
import { durationMinute, durationSecond } from "./duration.js";
export var timeMinute = timeInterval(function (date) {
  "worklet";

  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
}, function (date, step) {
  "worklet";

  date.setTime(+date + step * durationMinute);
}, function (start, end) {
  "worklet";

  return (end - start) / durationMinute;
}, function (date) {
  "worklet";

  return date.getMinutes();
});
export var timeMinutes = timeMinute.range;
export var utcMinute = timeInterval(function (date) {
  "worklet";

  date.setUTCSeconds(0, 0);
}, function (date, step) {
  "worklet";

  date.setTime(+date + step * durationMinute);
}, function (start, end) {
  "worklet";

  return (end - start) / durationMinute;
}, function (date) {
  "worklet";

  return date.getUTCMinutes();
});
export var utcMinutes = utcMinute.range;