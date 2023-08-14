function _createForOfIteratorHelper(o, allowArrayLike) { "worklet"; var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { ascending, bisect, quantileSorted as threshold } from "../d3-array";
import { initRange } from "./init.js";
export default function quantile() {
  "worklet";

  var domain = [],
    range = [],
    thresholds = [],
    unknown;
  function rescale() {
    "worklet";

    var i = 0,
      n = Math.max(1, range.length);
    thresholds = new Array(n - 1);
    while (++i < n) thresholds[i - 1] = threshold(domain, i / n);
    return scale;
  }
  function scale(x) {
    "worklet";

    return x == null || isNaN(x = +x) ? unknown : range[bisect(thresholds, x)];
  }
  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : [i > 0 ? thresholds[i - 1] : domain[0], i < thresholds.length ? thresholds[i] : domain[domain.length - 1]];
  };
  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [];
    var _iterator = _createForOfIteratorHelper(_),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var d = _step.value;
        if (d != null && !isNaN(d = +d)) domain.push(d);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    domain.sort(ascending);
    return rescale();
  };
  scale.range = function (_) {
    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
  };
  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.quantiles = function () {
    return thresholds.slice();
  };
  scale.copy = function () {
    return quantile().domain(domain).range(range).unknown(unknown);
  };
  return initRange.apply(scale, arguments);
}