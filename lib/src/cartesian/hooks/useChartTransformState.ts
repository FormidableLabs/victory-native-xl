import {
  makeMutable,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { scale, type Matrix4 } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { identity4 } from "../../utils/transform";

export type ChartTransformState = {
  panActive: SharedValue<boolean>;
  zoomActive: SharedValue<boolean>;
  origin: SharedValue<{ x: number; y: number }>;
  matrix: SharedValue<Matrix4>;
  offset: SharedValue<Matrix4>;
};

type ChartTransformStateConfig = {
  scaleX?: number;
  scaleY?: number;
};
export const useChartTransformState = (
  config?: ChartTransformStateConfig,
): {
  state: ChartTransformState;
} => {
  const origin = useSharedValue({ x: 0, y: 0 });
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  // This is done in a useEffect to prevent Reanimated warning
  // about setting shared value in the render phase
  useEffect(() => {
    // matrix.value = setScale(
    //   matrix.value,
    //   config?.scaleX ?? 1,
    //   config?.scaleY ?? 1,
    // );
    matrix.value = scale(config?.scaleX ?? 1, config?.scaleY ?? 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    state: {
      panActive: makeMutable(false),
      zoomActive: makeMutable(false),
      origin,
      matrix,
      offset,
    },
  };
};
