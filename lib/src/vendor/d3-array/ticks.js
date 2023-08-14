function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
var e10 = Math.sqrt(50),
  e5 = Math.sqrt(10),
  e2 = Math.sqrt(2);
function tickSpec(start, stop, count) {
  "worklet";

  var step = (stop - start) / Math.max(0, count),
    power = Math.floor(Math.log10(step)),
    error = step / Math.pow(10, power),
    factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  var i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
  return [i1, i2, inc];
}
export default function ticks(start, stop, count) {
  "worklet";

  stop = +stop, start = +start, count = +count;
  if (!(count > 0)) return [];
  if (start === stop) return [start];
  var reverse = stop < start,
    _ref = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count),
    _ref2 = _slicedToArray(_ref, 3),
    i1 = _ref2[0],
    i2 = _ref2[1],
    inc = _ref2[2];
  if (!(i2 >= i1)) return [];
  var n = i2 - i1 + 1,
    ticks = new Array(n);
  if (reverse) {
    if (inc < 0) for (var i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;else for (var _i2 = 0; _i2 < n; ++_i2) ticks[_i2] = (i2 - _i2) * inc;
  } else {
    if (inc < 0) for (var _i3 = 0; _i3 < n; ++_i3) ticks[_i3] = (i1 + _i3) / -inc;else for (var _i4 = 0; _i4 < n; ++_i4) ticks[_i4] = (i1 + _i4) * inc;
  }
  return ticks;
}
export function tickIncrement(start, stop, count) {
  "worklet";

  stop = +stop, start = +start, count = +count;
  return tickSpec(start, stop, count)[2];
}
export function tickStep(start, stop, count) {
  "worklet";

  stop = +stop, start = +start, count = +count;
  var reverse = stop < start,
    inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}