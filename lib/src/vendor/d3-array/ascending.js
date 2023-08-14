export default function ascending(a, b) {
  "worklet";

  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}