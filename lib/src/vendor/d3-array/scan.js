import leastIndex from "./leastIndex.js";
export default function scan(values, compare) {
  "worklet";

  var index = leastIndex(values, compare);
  return index < 0 ? undefined : index;
}