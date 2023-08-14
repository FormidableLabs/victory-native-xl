import ascending from "./ascending.js";
import bisector from "./bisector.js";
import number from "./number.js";
var ascendingBisect = bisector(ascending);
export var bisectRight = ascendingBisect.right;
export var bisectLeft = ascendingBisect.left;
export var bisectCenter = bisector(number).center;
export default bisectRight;