import type { PieSliceData } from "../PieSlice";
import type { PieSliceAngularInsetData } from "../PieSliceAngularInset";
type SliceAngularInsetPathArgs = {
    slice: PieSliceData;
    angularInset: PieSliceAngularInsetData;
};
export declare const useSliceAngularInsetPath: ({ angularInset, slice, }: SliceAngularInsetPathArgs) => readonly [import("@shopify/react-native-skia").SkPath, import("@shopify/react-native-skia").SkPaint];
export {};
