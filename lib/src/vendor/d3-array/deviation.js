import variance from "./variance.js";
export default function deviation(values, valueof) {
  "worklet";

  var v = variance(values, valueof);
  return v ? Math.sqrt(v) : v;
}