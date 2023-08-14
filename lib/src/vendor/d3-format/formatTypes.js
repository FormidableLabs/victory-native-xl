import formatDecimal from "./formatDecimal.js";
import formatPrefixAuto from "./formatPrefixAuto.js";
import formatRounded from "./formatRounded.js";
export default {
  "%": function _(x, p) {
    "worklet";

    return (x * 100).toFixed(p);
  },
  "b": function b(x) {
    "worklet";

    return Math.round(x).toString(2);
  },
  "c": function c(x) {
    "worklet";

    return x + "";
  },
  "d": formatDecimal,
  "e": function e(x, p) {
    "worklet";

    return x.toExponential(p);
  },
  "f": function f(x, p) {
    "worklet";

    return x.toFixed(p);
  },
  "g": function g(x, p) {
    "worklet";

    return x.toPrecision(p);
  },
  "o": function o(x) {
    "worklet";

    return Math.round(x).toString(8);
  },
  "p": function p(x, _p) {
    "worklet";

    return formatRounded(x * 100, _p);
  },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function X(x) {
    "worklet";

    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function x(_x) {
    "worklet";

    return Math.round(_x).toString(16);
  }
};