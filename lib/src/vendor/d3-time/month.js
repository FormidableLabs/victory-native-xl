import { timeInterval } from "./interval.js";
export var timeMonth = timeInterval(function (date) {
  "worklet";

  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setMonth(date.getMonth() + step);
}, function (start, end) {
  "worklet";

  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function (date) {
  "worklet";

  return date.getMonth();
});
export var timeMonths = timeMonth.range;
export var utcMonth = timeInterval(function (date) {
  "worklet";

  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setUTCMonth(date.getUTCMonth() + step);
}, function (start, end) {
  "worklet";

  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function (date) {
  "worklet";

  return date.getUTCMonth();
});
export var utcMonths = utcMonth.range;