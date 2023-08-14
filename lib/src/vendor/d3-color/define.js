export default function (constructor, factory, prototype) {
  "worklet";

  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
export function extend(parent, definition) {
  "worklet";

  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}