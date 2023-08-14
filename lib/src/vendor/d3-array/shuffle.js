export default shuffler(Math.random);
export function shuffler(random) {
  "worklet";

  return function shuffle(array) {
    var i0 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var i1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array.length;
    var m = i1 - (i0 = +i0);
    while (m) {
      var i = random() * m-- | 0,
        t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    }
    return array;
  };
}