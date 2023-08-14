function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { bisector, tickStep } from "../d3-array";
import { durationDay, durationHour, durationMinute, durationMonth, durationSecond, durationWeek, durationYear } from "./duration.js";
import { millisecond } from "./millisecond.js";
import { second } from "./second.js";
import { timeMinute, utcMinute } from "./minute.js";
import { timeHour, utcHour } from "./hour.js";
import { timeDay, unixDay } from "./day.js";
import { timeSunday, utcSunday } from "./week.js";
import { timeMonth, utcMonth } from "./month.js";
import { timeYear, utcYear } from "./year.js";
function ticker(year, month, week, day, hour, minute) {
  "worklet";

  var tickIntervals = [[second, 1, durationSecond], [second, 5, 5 * durationSecond], [second, 15, 15 * durationSecond], [second, 30, 30 * durationSecond], [minute, 1, durationMinute], [minute, 5, 5 * durationMinute], [minute, 15, 15 * durationMinute], [minute, 30, 30 * durationMinute], [hour, 1, durationHour], [hour, 3, 3 * durationHour], [hour, 6, 6 * durationHour], [hour, 12, 12 * durationHour], [day, 1, durationDay], [day, 2, 2 * durationDay], [week, 1, durationWeek], [month, 1, durationMonth], [month, 3, 3 * durationMonth], [year, 1, durationYear]];
  function ticks(start, stop, count) {
    "worklet";

    var reverse = stop < start;
    if (reverse) {
      var _ref = [stop, start];
      start = _ref[0];
      stop = _ref[1];
    }
    var interval = count && typeof count.range === "function" ? count : tickInterval(start, stop, count);
    var ticks = interval ? interval.range(start, +stop + 1) : []; // inclusive stop
    return reverse ? ticks.reverse() : ticks;
  }
  function tickInterval(start, stop, count) {
    "worklet";

    var target = Math.abs(stop - start) / count;
    var i = bisector(function (_ref2) {
      "worklet";

      var _ref3 = _slicedToArray(_ref2, 3),
        step = _ref3[2];
      return step;
    }).right(tickIntervals, target);
    if (i === tickIntervals.length) return year.every(tickStep(start / durationYear, stop / durationYear, count));
    if (i === 0) return millisecond.every(Math.max(tickStep(start, stop, count), 1));
    var _tickIntervals = _slicedToArray(tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i], 2),
      t = _tickIntervals[0],
      step = _tickIntervals[1];
    return t.every(step);
  }
  return [ticks, tickInterval];
}
var _ticker = ticker(utcYear, utcMonth, utcSunday, unixDay, utcHour, utcMinute),
  _ticker2 = _slicedToArray(_ticker, 2),
  utcTicks = _ticker2[0],
  utcTickInterval = _ticker2[1];
var _ticker3 = ticker(timeYear, timeMonth, timeSunday, timeDay, timeHour, timeMinute),
  _ticker4 = _slicedToArray(_ticker3, 2),
  timeTicks = _ticker4[0],
  timeTickInterval = _ticker4[1];
export { utcTicks, utcTickInterval, timeTicks, timeTickInterval };