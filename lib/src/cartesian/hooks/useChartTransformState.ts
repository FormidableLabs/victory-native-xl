import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  type Matrix4,
  Skia,
  type SkMatrix,
  toMatrix3,
} from "@shopify/react-native-skia";

export const identity4: Matrix4 = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
];

export type ChartTransformState = {
  transformMatrix: SharedValue<SkMatrix>;
  origin: SharedValue<{ x: number; y: number }>;
  matrix: SharedValue<Matrix4>;
  offset: SharedValue<Matrix4>;
};

export const useChartTransformState = (): ChartTransformState => {
  const origin = useSharedValue({ x: 0, y: 0 });
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  const transformMatrix = useDerivedValue(() => {
    return Skia.Matrix(toMatrix3(matrix.value));
  });

  return {
    transformMatrix,
    origin,
    matrix,
    offset,
  };
};
