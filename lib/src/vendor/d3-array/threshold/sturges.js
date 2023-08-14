import count from "../count.js";
export default function thresholdSturges(values) {
  "worklet";

  return Math.max(1, Math.ceil(Math.log(count(values)) / Math.LN2) + 1);
}