import { timeInterval } from "./interval.js";
import { durationSecond } from "./duration.js";
export var second = timeInterval(function (date) {
  "worklet";

  date.setTime(date - date.getMilliseconds());
}, function (date, step) {
  "worklet";

  date.setTime(+date + step * durationSecond);
}, function (start, end) {
  "worklet";

  return (end - start) / durationSecond;
}, function (date) {
  "worklet";

  return date.getUTCSeconds();
});
export var seconds = second.range;