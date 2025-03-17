import { type SkPath } from "@shopify/react-native-skia";
import type { PieSliceData } from "../PieSlice";
type SlicePathArgs = {
    slice: PieSliceData;
};
export declare const useSlicePath: ({ slice }: SlicePathArgs) => SkPath;
export {};
