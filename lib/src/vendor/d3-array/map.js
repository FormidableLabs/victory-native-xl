export default function map(values, mapper) {
  "worklet";

  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  if (typeof mapper !== "function") throw new TypeError("mapper is not a function");
  return Array.from(values, function (value, index) {
    "worklet";

    return mapper(value, index, values);
  });
}