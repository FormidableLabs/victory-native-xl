import { linearish } from "./linear.js";
import { copy, identity, transformer } from "./continuous.js";
import { initRange } from "./init.js";
function transformPow(exponent) {
  "worklet";

  return function (x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}
function transformSqrt(x) {
  "worklet";

  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}
function transformSquare(x) {
  "worklet";

  return x < 0 ? -x * x : x * x;
}
export function powish(transform) {
  "worklet";

  var scale = transform(identity, identity),
    exponent = 1;
  function rescale() {
    "worklet";

    return exponent === 1 ? transform(identity, identity) : exponent === 0.5 ? transform(transformSqrt, transformSquare) : transform(transformPow(exponent), transformPow(1 / exponent));
  }
  scale.exponent = function (_) {
    return arguments.length ? (exponent = +_, rescale()) : exponent;
  };
  return linearish(scale);
}
export default function pow() {
  "worklet";

  var scale = powish(transformer());
  scale.copy = function () {
    return copy(scale, pow()).exponent(scale.exponent());
  };
  initRange.apply(scale, arguments);
  return scale;
}
export function sqrt() {
  "worklet";

  return pow.apply(null, arguments).exponent(0.5);
}