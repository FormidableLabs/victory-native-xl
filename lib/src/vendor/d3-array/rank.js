import ascending from "./ascending.js";
import { ascendingDefined, compareDefined } from "./sort.js";
export default function rank(values) {
  "worklet";

  var valueof = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ascending;
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  var V = Array.from(values);
  var R = new Float64Array(V.length);
  if (valueof.length !== 2) V = V.map(valueof), valueof = ascending;
  var compareIndex = function compareIndex(i, j) {
    "worklet";

    return valueof(V[i], V[j]);
  };
  var k, r;
  values = Uint32Array.from(V, function (_, i) {
    "worklet";

    return i;
  });
  // Risky chaining due to Safari 14 https://github.com/d3/d3-array/issues/123
  values.sort(valueof === ascending ? function (i, j) {
    "worklet";

    return ascendingDefined(V[i], V[j]);
  } : compareDefined(compareIndex));
  values.forEach(function (j, i) {
    "worklet";

    var c = compareIndex(j, k === undefined ? j : k);
    if (c >= 0) {
      if (k === undefined || c > 0) k = j, r = i;
      R[j] = r;
    } else {
      R[j] = NaN;
    }
  });
  return R;
}