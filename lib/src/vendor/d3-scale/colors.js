export default function colors(s) {
  "worklet";

  return s.match(/.{6}/g).map(function (x) {
    return "#" + x;
  });
}