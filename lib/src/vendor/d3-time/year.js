import { timeInterval } from "./interval.js";
export var timeYear = timeInterval(function (date) {
  "worklet";

  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setFullYear(date.getFullYear() + step);
}, function (start, end) {
  "worklet";

  return end.getFullYear() - start.getFullYear();
}, function (date) {
  "worklet";

  return date.getFullYear();
});

// An optimized implementation for this simple case.
timeYear.every = function (k) {
  "worklet";

  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval(function (date) {
    "worklet";

    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    "worklet";

    date.setFullYear(date.getFullYear() + step * k);
  });
};
export var timeYears = timeYear.range;
export var utcYear = timeInterval(function (date) {
  "worklet";

  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  "worklet";

  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function (start, end) {
  "worklet";

  return end.getUTCFullYear() - start.getUTCFullYear();
}, function (date) {
  "worklet";

  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function (k) {
  "worklet";

  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval(function (date) {
    "worklet";

    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    "worklet";

    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};
export var utcYears = utcYear.range;