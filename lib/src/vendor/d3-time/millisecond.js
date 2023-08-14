import { timeInterval } from "./interval.js";
export var millisecond = timeInterval(function () {
  "worklet";
} // noop
, function (date, step) {
  "worklet";

  date.setTime(+date + step);
}, function (start, end) {
  "worklet";

  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function (k) {
  "worklet";

  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return timeInterval(function (date) {
    "worklet";

    date.setTime(Math.floor(date / k) * k);
  }, function (date, step) {
    "worklet";

    date.setTime(+date + step * k);
  }, function (start, end) {
    "worklet";

    return (end - start) / k;
  });
};
export var milliseconds = millisecond.range;