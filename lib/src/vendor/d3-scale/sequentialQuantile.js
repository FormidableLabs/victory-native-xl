function _createForOfIteratorHelper(o, allowArrayLike) { "worklet"; var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import { ascending, bisect, quantile } from "../d3-array";
import { identity } from "./continuous.js";
import { initInterpolator } from "./init.js";
export default function sequentialQuantile() {
  "worklet";

  var domain = [],
    interpolator = identity;
  function scale(x) {
    "worklet";

    if (x != null && !isNaN(x = +x)) return interpolator((bisect(domain, x, 1) - 1) / (domain.length - 1));
  }
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
    return scale;
  };
  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };
  scale.range = function () {
    return domain.map(function (d, i) {
      "worklet";

      return interpolator(i / (domain.length - 1));
    });
  };
  scale.quantiles = function (n) {
    return Array.from({
      length: n + 1
    }, function (_, i) {
      "worklet";

      return quantile(domain, i / n);
    });
  };
  scale.copy = function () {
    return sequentialQuantile(interpolator).domain(domain);
  };
  return initInterpolator.apply(scale, arguments);
}