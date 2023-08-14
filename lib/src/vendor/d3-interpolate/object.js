function _typeof(obj) { "worklet"; "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
import value from "./value.js";
export default function (a, b) {
  "worklet";

  var i = {},
    c = {},
    k;
  if (a === null || _typeof(a) !== "object") a = {};
  if (b === null || _typeof(b) !== "object") b = {};
  for (k in b) {
    if (k in a) {
      i[k] = value(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }
  return function (t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}