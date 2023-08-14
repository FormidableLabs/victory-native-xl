function _createForOfIteratorHelper(o, allowArrayLike) { "worklet"; var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
import ascending from "./ascending.js";
export default function least(values) {
  "worklet";

  var compare = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ascending;
  var min;
  var defined = false;
  if (compare.length === 1) {
    var minValue;
    var _iterator = _createForOfIteratorHelper(values),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var element = _step.value;
        var value = compare(element);
        if (defined ? ascending(value, minValue) < 0 : ascending(value, value) === 0) {
          min = element;
          minValue = value;
          defined = true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    var _iterator2 = _createForOfIteratorHelper(values),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _value = _step2.value;
        if (defined ? compare(_value, min) < 0 : compare(_value, _value) === 0) {
          min = _value;
          defined = true;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  return min;
}