import { ascendingDefined, compareDefined } from "./sort.js";

// Based on https://github.com/mourner/quickselect
// ISC license, Copyright 2018 Vladimir Agafonkin.
export default function quickselect(array, k) {
  "worklet";

  var left = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var right = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;
  var compare = arguments.length > 4 ? arguments[4] : undefined;
  k = Math.floor(k);
  left = Math.floor(Math.max(0, left));
  right = Math.floor(Math.min(array.length - 1, right));
  if (!(left <= k && k <= right)) return array;
  compare = compare === undefined ? ascendingDefined : compareDefined(compare);
  while (right > left) {
    if (right - left > 600) {
      var n = right - left + 1;
      var m = k - left + 1;
      var z = Math.log(n);
      var s = 0.5 * Math.exp(2 * z / 3);
      var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselect(array, k, newLeft, newRight, compare);
    }
    var t = array[k];
    var i = left;
    var j = right;
    swap(array, left, k);
    if (compare(array[right], t) > 0) swap(array, left, right);
    while (i < j) {
      swap(array, i, j), ++i, --j;
      while (compare(array[i], t) < 0) ++i;
      while (compare(array[j], t) > 0) --j;
    }
    if (compare(array[left], t) === 0) swap(array, left, j);else ++j, swap(array, j, right);
    if (j <= k) left = j + 1;
    if (k <= j) right = j - 1;
  }
  return array;
}
function swap(array, i, j) {
  "worklet";

  var t = array[i];
  array[i] = array[j];
  array[j] = t;
}