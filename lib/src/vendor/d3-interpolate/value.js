function _typeof(obj) { "worklet"; "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
import { color } from "../d3-color";
import rgb from "./rgb.js";
import { genericArray } from "./array.js";
import date from "./date.js";
import number from "./number.js";
import object from "./object.js";
import string from "./string.js";
import constant from "./constant.js";
import numberArray, { isNumberArray } from "./numberArray.js";
export default function (a, b) {
  "worklet";

  var t = _typeof(b),
    c;
  return b == null || t === "boolean" ? constant(b) : (t === "number" ? number : t === "string" ? (c = color(b)) ? (b = c, rgb) : string : b instanceof color ? rgb : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : number)(a, b);
}