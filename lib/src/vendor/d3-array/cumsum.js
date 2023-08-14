export default function cumsum(values, valueof) {
  "worklet";

  var sum = 0,
    index = 0;
  return Float64Array.from(values, valueof === undefined ? function (v) {
    "worklet";

    return sum += +v || 0;
  } : function (v) {
    "worklet";

    return sum += +valueof(v, index++, values) || 0;
  });
}