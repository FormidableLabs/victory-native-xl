import { ViewWindow } from "./types";

export const map = (
  value: number,
  xi: number,
  xf: number,
  yi: number,
  yf: number,
) => {
  "worklet";
  return yi + ((yf - yi) * (value - xi)) / (xf - xi);
};

export const mapPoint = (
  [x, y]: [number, number],
  inputWindow: ViewWindow,
  outputWindow: ViewWindow,
) => {
  "worklet";

  const newX = map(
    x,
    inputWindow.xMin.value,
    inputWindow.xMax.value,
    outputWindow.xMin.value,
    outputWindow.xMax.value,
  );
  const newY = map(
    y,
    inputWindow.yMin.value,
    inputWindow.yMax.value,
    outputWindow.yMin.value,
    outputWindow.yMax.value,
  );

  return [newX, newY];
};

export const mapPointX = (
  x: number,
  inputWindow: ViewWindow,
  outputWindow: ViewWindow,
) => {
  "worklet";
  return map(
    x,
    inputWindow.xMin.value,
    inputWindow.xMax.value,
    outputWindow.xMin.value,
    outputWindow.xMax.value,
  );
};

export const mapPointY = (
  x: number,
  inputWindow: ViewWindow,
  outputWindow: ViewWindow,
) => {
  "worklet";
  return map(
    x,
    inputWindow.yMin.value,
    inputWindow.yMax.value,
    outputWindow.yMin.value,
    outputWindow.yMax.value,
  );
};
