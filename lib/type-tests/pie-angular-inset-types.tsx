import React from "react";
import { Path, type SkPaint, type SkPath } from "@shopify/react-native-skia";
import { useSliceAngularInsetPath, type PieSliceData } from "victory-native";

declare const slice: PieSliceData;

export function UseSliceAngularInsetPathTuple() {
  const result: readonly [SkPath, SkPaint] = useSliceAngularInsetPath({
    slice,
    angularInset: {
      angularStrokeColor: "#141416",
      angularStrokeWidth: 3,
    },
  });
  const [path, paint] = result;

  return <Path path={path} paint={paint} />;
}
