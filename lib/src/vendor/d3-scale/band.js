function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { range as sequence } from "../d3-array";
import { initRange } from "./init.js";
import ordinal from "./ordinal.js";
export default function band() {
  "worklet";

  var scale = ordinal().unknown(undefined),
    domain = scale.domain,
    ordinalRange = scale.range,
    r0 = 0,
    r1 = 1,
    step,
    bandwidth,
    round = false,
    paddingInner = 0,
    paddingOuter = 0,
    align = 0.5;
  delete scale.unknown;
  function rescale() {
    "worklet";

    var n = domain().length,
      reverse = r1 < r0,
      start = reverse ? r1 : r0,
      stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = sequence(n).map(function (i) {
      return start + step * i;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }
  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.range = function (_) {
    var _ref;
    return arguments.length ? ((_ref = _slicedToArray(_, 2), r0 = _ref[0], r1 = _ref[1]), r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };
  scale.rangeRound = function (_) {
    var _ref2;
    return (_ref2 = _slicedToArray(_, 2), r0 = _ref2[0], r1 = _ref2[1]), r0 = +r0, r1 = +r1, round = true, rescale();
  };
  scale.bandwidth = function () {
    return bandwidth;
  };
  scale.step = function () {
    return step;
  };
  scale.round = function (_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };
  scale.padding = function (_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };
  scale.paddingInner = function (_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };
  scale.paddingOuter = function (_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };
  scale.align = function (_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };
  scale.copy = function () {
    return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };
  return initRange.apply(rescale(), arguments);
}
function pointish(scale) {
  "worklet";

  var copy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;
  scale.copy = function () {
    return pointish(copy());
  };
  return scale;
}
export function point() {
  "worklet";

  return pointish(band.apply(null, arguments).paddingInner(1));
}