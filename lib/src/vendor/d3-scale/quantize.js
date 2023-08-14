function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { bisect } from "../d3-array";
import { linearish } from "./linear.js";
import { initRange } from "./init.js";
export default function quantize() {
  "worklet";

  var x0 = 0,
    x1 = 1,
    n = 1,
    domain = [0.5],
    range = [0, 1],
    unknown;
  function scale(x) {
    "worklet";

    return x != null && x <= x ? range[bisect(domain, x, 0, n)] : unknown;
  }
  function rescale() {
    "worklet";

    var i = -1;
    domain = new Array(n);
    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
    return scale;
  }
  scale.domain = function (_) {
    var _ref;
    return arguments.length ? ((_ref = _slicedToArray(_, 2), x0 = _ref[0], x1 = _ref[1]), x0 = +x0, x1 = +x1, rescale()) : [x0, x1];
  };
  scale.range = function (_) {
    return arguments.length ? (n = (range = Array.from(_)).length - 1, rescale()) : range.slice();
  };
  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : i < 1 ? [x0, domain[0]] : i >= n ? [domain[n - 1], x1] : [domain[i - 1], domain[i]];
  };
  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : scale;
  };
  scale.thresholds = function () {
    return domain.slice();
  };
  scale.copy = function () {
    return quantize().domain([x0, x1]).range(range).unknown(unknown);
  };
  return initRange.apply(linearish(scale), arguments);
}