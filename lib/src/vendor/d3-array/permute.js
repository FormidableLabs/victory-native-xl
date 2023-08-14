export default function permute(source, keys) {
  "worklet";

  return Array.from(keys, function (key) {
    "worklet";

    return source[key];
  });
}