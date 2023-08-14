import { timeInterval } from "./interval.js";
import { durationDay, durationMinute } from "./duration.js";
export var timeDay = timeInterval(function (date) {
  "worklet";

  return date.setHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  return date.setDate(date.getDate() + step);
}, function (start, end) {
  "worklet";

  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function (date) {
  "worklet";

  return date.getDate() - 1;
});
export var timeDays = timeDay.range;
export var utcDay = timeInterval(function (date) {
  "worklet";

  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  "worklet";

  return (end - start) / durationDay;
}, function (date) {
  "worklet";

  return date.getUTCDate() - 1;
});
export var utcDays = utcDay.range;
export var unixDay = timeInterval(function (date) {
  "worklet";

  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  "worklet";

  return (end - start) / durationDay;
}, function (date) {
  "worklet";

  return Math.floor(date / durationDay);
});
export var unixDays = unixDay.range;