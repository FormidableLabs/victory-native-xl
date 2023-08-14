function _createForOfIteratorHelper(o, allowArrayLike) { "worklet"; var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import ascending from "./ascending.js";
import permute from "./permute.js";
export default function sort(values) {
  "worklet";

  for (var _len = arguments.length, F = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    F[_key - 1] = arguments[_key];
  }
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  values = Array.from(values);
  var _F = F,
    _F2 = _slicedToArray(_F, 1),
    f = _F2[0];
  if (f && f.length !== 2 || F.length > 1) {
    var index = Uint32Array.from(values, function (d, i) {
      "worklet";

      return i;
    });
    if (F.length > 1) {
      F = F.map(function (f) {
        "worklet";

        return values.map(f);
      });
      index.sort(function (i, j) {
        "worklet";

        var _iterator = _createForOfIteratorHelper(F),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _f = _step.value;
            var c = ascendingDefined(_f[i], _f[j]);
            if (c) return c;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
    } else {
      f = values.map(f);
      index.sort(function (i, j) {
        "worklet";

        return ascendingDefined(f[i], f[j]);
      });
    }
    return permute(values, index);
  }
  return values.sort(compareDefined(f));
}
export function compareDefined() {
  "worklet";

  var compare = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ascending;
  if (compare === ascending) return ascendingDefined;
  if (typeof compare !== "function") throw new TypeError("compare is not a function");
  return function (a, b) {
    "worklet";

    var x = compare(a, b);
    if (x || x === 0) return x;
    return (compare(b, b) === 0) - (compare(a, a) === 0);
  };
}
export function ascendingDefined(a, b) {
  "worklet";

  return (a == null || !(a >= a)) - (b == null || !(b >= b)) || (a < b ? -1 : a > b ? 1 : 0);
}