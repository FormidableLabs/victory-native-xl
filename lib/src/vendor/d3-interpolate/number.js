export default function (a, b) {
  "worklet";

  return a = +a, b = +b, function (t) {
    return a * (1 - t) + b * t;
  };
}