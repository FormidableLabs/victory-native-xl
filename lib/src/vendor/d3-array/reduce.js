export default function reduce(values, reducer, value) {
  "worklet";

  if (typeof reducer !== "function") throw new TypeError("reducer is not a function");
  var iterator = values[Symbol.iterator]();
  var done,
    next,
    index = -1;
  if (arguments.length < 3) {
    var _iterator$next = iterator.next();
    done = _iterator$next.done;
    value = _iterator$next.value;
    if (done) return;
    ++index;
  }
  while ((_iterator$next2 = iterator.next(), done = _iterator$next2.done, next = _iterator$next2.value), !done) {
    var _iterator$next2;
    value = reducer(value, next, ++index, values);
  }
  return value;
}