export default function (a, b) {
  "worklet";

  return a = +a, b = +b, function (t) {
    return Math.round(a * (1 - t) + b * t);
  };
}