import quantile, { quantileIndex } from "./quantile.js";
export default function median(values, valueof) {
  "worklet";

  return quantile(values, 0.5, valueof);
}
export function medianIndex(values, valueof) {
  "worklet";

  return quantileIndex(values, 0.5, valueof);
}