import {
  makeMutable,
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

const getActions = (matrix: SharedValue<Matrix4>) => {
  const setScale = (k: number) => {
    "worklet";
    const next = matrix.value.slice(0);
    // next[0] = k;
    // next[3] = k;

    matrix.value = next as unknown as Matrix4;
  };

  return {
    setScale: setScale,
  };
};

type CharTransformActions = {
  setScale: () => void;
};

export type ChartTransformState = {
  panActive: SharedValue<boolean>;
  zoomActive: SharedValue<boolean>;
  transformMatrix: SharedValue<SkMatrix>;
  origin: SharedValue<{ x: number; y: number }>;
  matrix: SharedValue<Matrix4>;
  offset: SharedValue<Matrix4>;
};

export const useChartTransformState = (): {
  state: ChartTransformState;
  actions: CharTransformActions;
} => {
  const origin = useSharedValue({ x: 0, y: 0 });
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  const transformMatrix = useDerivedValue(() => {
    return Skia.Matrix(toMatrix3(matrix.value));
  });

  return {
    state: {
      panActive: makeMutable(false),
      zoomActive: makeMutable(false),
      transformMatrix,
      origin,
      matrix,
      offset,
    },
    actions: getActions(matrix),
  };
};
