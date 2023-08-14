import superset from "./superset.js";
export default function subset(values, other) {
  "worklet";

  return superset(other, values);
}