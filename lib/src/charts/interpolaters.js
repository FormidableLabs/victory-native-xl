export const map = (value, xi, xf, yi, yf) => {
    "worklet";
    return yi + ((yf - yi) * (value - xi)) / (xf - xi);
};
export const mapPoint = ([x, y], inputWindow, outputWindow) => {
    "worklet";
    const newX = map(x, inputWindow.xMin.value, inputWindow.xMax.value, outputWindow.xMin.value, outputWindow.xMax.value);
    const newY = map(y, inputWindow.yMin.value, inputWindow.yMax.value, outputWindow.yMin.value, outputWindow.yMax.value);
    return [newX, newY];
};
export const mapPointX = (x, inputWindow, outputWindow) => {
    "worklet";
    return map(x, inputWindow.xMin.value, inputWindow.xMax.value, outputWindow.xMin.value, outputWindow.xMax.value);
};
export const mapPointY = (x, inputWindow, outputWindow) => {
    "worklet";
    return map(x, inputWindow.yMin.value, inputWindow.yMax.value, outputWindow.yMin.value, outputWindow.yMax.value);
};
