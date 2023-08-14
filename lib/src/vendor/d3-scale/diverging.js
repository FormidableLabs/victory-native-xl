function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { interpolate, interpolateRound, piecewise } from "../d3-interpolate";
import { identity } from "./continuous.js";
import { initInterpolator } from "./init.js";
import { linearish } from "./linear.js";
import { loggish } from "./log.js";
import { copy } from "./sequential.js";
import { symlogish } from "./symlog.js";
import { powish } from "./pow.js";
function transformer() {
  "worklet";

  var x0 = 0,
    x1 = 0.5,
    x2 = 1,
    s = 1,
    t0,
    t1,
    t2,
    k10,
    k21,
    interpolator = identity,
    transform,
    clamp = false,
    unknown;
  function scale(x) {
    "worklet";

    return isNaN(x = +x) ? unknown : (x = 0.5 + ((x = +transform(x)) - t1) * (s * x < s * t1 ? k10 : k21), interpolator(clamp ? Math.max(0, Math.min(1, x)) : x));
  }
  scale.domain = function (_) {
    var _ref;
    return arguments.length ? ((_ref = _slicedToArray(_, 3), x0 = _ref[0], x1 = _ref[1], x2 = _ref[2]), t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), t2 = transform(x2 = +x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), s = t1 < t0 ? -1 : 1, scale) : [x0, x1, x2];
  };
  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };
  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };
  function range(interpolate) {
    "worklet";

    return function (_) {
      var _ref2;
      var r0, r1, r2;
      return arguments.length ? ((_ref2 = _slicedToArray(_, 3), r0 = _ref2[0], r1 = _ref2[1], r2 = _ref2[2]), interpolator = piecewise(interpolate, [r0, r1, r2]), scale) : [interpolator(0), interpolator(0.5), interpolator(1)];
    };
  }
  scale.range = range(interpolate);
  scale.rangeRound = range(interpolateRound);
  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function (t) {
    transform = t, t0 = t(x0), t1 = t(x1), t2 = t(x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), s = t1 < t0 ? -1 : 1;
    return scale;
  };
}
export default function diverging() {
  "worklet";

  var scale = linearish(transformer()(identity));
  scale.copy = function () {
    return copy(scale, diverging());
  };
  return initInterpolator.apply(scale, arguments);
}
export function divergingLog() {
  "worklet";

  var scale = loggish(transformer()).domain([0.1, 1, 10]);
  scale.copy = function () {
    return copy(scale, divergingLog()).base(scale.base());
  };
  return initInterpolator.apply(scale, arguments);
}
export function divergingSymlog() {
  "worklet";

  var scale = symlogish(transformer());
  scale.copy = function () {
    return copy(scale, divergingSymlog()).constant(scale.constant());
  };
  return initInterpolator.apply(scale, arguments);
}
export function divergingPow() {
  "worklet";

  var scale = powish(transformer());
  scale.copy = function () {
    return copy(scale, divergingPow()).exponent(scale.exponent());
  };
  return initInterpolator.apply(scale, arguments);
}
export function divergingSqrt() {
  "worklet";

  return divergingPow.apply(null, arguments).exponent(0.5);
}