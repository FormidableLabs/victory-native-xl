// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Skia } from "@shopify/react-native-skia";
export const makeLinearPath = (xValues, yValues, x, y) => {
    "worklet";
    const path = Skia.Path.Make();
    if (!xValues.length)
        return path;
    path.moveTo(x(xValues[0]), y(yValues[0]));
    xValues.forEach((val, i) => {
        path.lineTo(x(val), y(yValues[i]));
    });
    return path;
};
