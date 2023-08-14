function _createForOfIteratorHelper(o, allowArrayLike) { "worklet"; var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { "worklet"; return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { "worklet"; throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { "worklet"; if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { "worklet"; if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import { InternMap } from "../internmap";
import identity from "./identity.js";
export default function group(values) {
  "worklet";

  for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }
  return nest(values, identity, identity, keys);
}
export function groups(values) {
  "worklet";

  for (var _len2 = arguments.length, keys = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }
  return nest(values, Array.from, identity, keys);
}
function flatten(groups, keys) {
  "worklet";

  for (var i = 1, n = keys.length; i < n; ++i) {
    groups = groups.flatMap(function (g) {
      "worklet";

      return g.pop().map(function (_ref) {
        "worklet";

        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        return [].concat(_toConsumableArray(g), [key, value]);
      });
    });
  }
  return groups;
}
export function flatGroup(values) {
  "worklet";

  for (var _len3 = arguments.length, keys = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    keys[_key3 - 1] = arguments[_key3];
  }
  return flatten(groups.apply(void 0, [values].concat(keys)), keys);
}
export function flatRollup(values, reduce) {
  "worklet";

  for (var _len4 = arguments.length, keys = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    keys[_key4 - 2] = arguments[_key4];
  }
  return flatten(rollups.apply(void 0, [values, reduce].concat(keys)), keys);
}
export function rollup(values, reduce) {
  "worklet";

  for (var _len5 = arguments.length, keys = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    keys[_key5 - 2] = arguments[_key5];
  }
  return nest(values, identity, reduce, keys);
}
export function rollups(values, reduce) {
  "worklet";

  for (var _len6 = arguments.length, keys = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    keys[_key6 - 2] = arguments[_key6];
  }
  return nest(values, Array.from, reduce, keys);
}
export function index(values) {
  "worklet";

  for (var _len7 = arguments.length, keys = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    keys[_key7 - 1] = arguments[_key7];
  }
  return nest(values, identity, unique, keys);
}
export function indexes(values) {
  "worklet";

  for (var _len8 = arguments.length, keys = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    keys[_key8 - 1] = arguments[_key8];
  }
  return nest(values, Array.from, unique, keys);
}
function unique(values) {
  "worklet";

  if (values.length !== 1) throw new Error("duplicate key");
  return values[0];
}
function nest(values, map, reduce, keys) {
  "worklet";

  return function regroup(values, i) {
    if (i >= keys.length) return reduce(values);
    var groups = new InternMap();
    var keyof = keys[i++];
    var index = -1;
    var _iterator = _createForOfIteratorHelper(values),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var value = _step.value;
        var key = keyof(value, ++index, values);
        var _group = groups.get(key);
        if (_group) _group.push(value);else groups.set(key, [value]);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(groups),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _step2$value = _slicedToArray(_step2.value, 2),
          _key9 = _step2$value[0],
          _values = _step2$value[1];
        groups.set(_key9, regroup(_values, i));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return map(groups);
  }(values, 0);
}