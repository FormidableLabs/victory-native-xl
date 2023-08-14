function _slicedToArray(arr, i) { "worklet"; return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { "worklet"; throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { "worklet"; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { "worklet"; if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { "worklet"; var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { "worklet"; if (Array.isArray(arr)) return arr; }
import ascending from "./ascending.js";
import group, { rollup } from "./group.js";
import sort from "./sort.js";
export default function groupSort(values, reduce, key) {
  "worklet";

  return (reduce.length !== 2 ? sort(rollup(values, reduce, key), function (_ref, _ref2) {
    "worklet";

    var _ref3 = _slicedToArray(_ref, 2),
      ak = _ref3[0],
      av = _ref3[1];
    var _ref4 = _slicedToArray(_ref2, 2),
      bk = _ref4[0],
      bv = _ref4[1];
    return ascending(av, bv) || ascending(ak, bk);
  }) : sort(group(values, key), function (_ref5, _ref6) {
    "worklet";

    var _ref7 = _slicedToArray(_ref5, 2),
      ak = _ref7[0],
      av = _ref7[1];
    var _ref8 = _slicedToArray(_ref6, 2),
      bk = _ref8[0],
      bv = _ref8[1];
    return reduce(av, bv) || ascending(ak, bk);
  })).map(function (_ref9) {
    "worklet";

    var _ref10 = _slicedToArray(_ref9, 1),
      key = _ref10[0];
    return key;
  });
}