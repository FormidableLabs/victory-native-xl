function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { interpolate, interpolateRound } from "../d3-interpolate";
import { identity } from "./continuous.js";
import { initInterpolator } from "./init.js";
import { linearish } from "./linear.js";
import { loggish } from "./log.js";
import { symlogish } from "./symlog.js";
import { powish } from "./pow.js";
function transformer() {
  "worklet";

  var x0 = 0,
    x1 = 1,
    t0,
    t1,
    k10,
    transform,
    interpolator = identity,
    clamp = false,
    unknown;
  function scale(x) {
    "worklet";

    return x == null || isNaN(x = +x) ? unknown : interpolator(k10 === 0 ? 0.5 : (x = (transform(x) - t0) * k10, clamp ? Math.max(0, Math.min(1, x)) : x));
  }
  scale.domain = function (_) {
    var _ref;
    return arguments.length ? ((_ref = _slicedToArray(_, 2), x0 = _ref[0], x1 = _ref[1]), t0 = transform(x0 = +x0), t1 = transform(x1 = +x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [x0, x1];
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
      var r0, r1;
      return arguments.length ? ((_ref2 = _slicedToArray(_, 2), r0 = _ref2[0], r1 = _ref2[1]), interpolator = interpolate(r0, r1), scale) : [interpolator(0), interpolator(1)];
    };
  }
  scale.range = range(interpolate);
  scale.rangeRound = range(interpolateRound);
  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function (t) {
    transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0);
    return scale;
  };
}
export function copy(source, target) {
  "worklet";

  return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
}
export default function sequential() {
  "worklet";

  var scale = linearish(transformer()(identity));
  scale.copy = function () {
    return copy(scale, sequential());
  };
  return initInterpolator.apply(scale, arguments);
}
export function sequentialLog() {
  "worklet";

  var scale = loggish(transformer()).domain([1, 10]);
  scale.copy = function () {
    return copy(scale, sequentialLog()).base(scale.base());
  };
  return initInterpolator.apply(scale, arguments);
}
export function sequentialSymlog() {
  "worklet";

  var scale = symlogish(transformer());
  scale.copy = function () {
    return copy(scale, sequentialSymlog()).constant(scale.constant());
  };
  return initInterpolator.apply(scale, arguments);
}
export function sequentialPow() {
  "worklet";

  var scale = powish(transformer());
  scale.copy = function () {
    return copy(scale, sequentialPow()).exponent(scale.exponent());
  };
  return initInterpolator.apply(scale, arguments);
}
export function sequentialSqrt() {
  "worklet";

  return sequentialPow.apply(null, arguments).exponent(0.5);
}