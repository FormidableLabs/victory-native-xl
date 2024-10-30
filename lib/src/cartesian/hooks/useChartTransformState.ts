import {
  makeMutable,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  type Matrix4,
  multiply4,
  scale,
  translate,
} from "@shopify/react-native-skia";

export const identity4: Matrix4 = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
];

enum MatrixValues {
  ScaleX = 0,
  ScaleY = 5,
  TranslateX = 3,
  TranslateY = 7,
}
const getActions = (matrix: SharedValue<Matrix4>) => {
  const getTransformComponents = () => {
    "worklet";

    return {
      scaleX: matrix.value[MatrixValues.ScaleX],
      scaleY: matrix.value[MatrixValues.ScaleY],
      translateX: matrix.value[MatrixValues.TranslateX],
      translateY: matrix.value[MatrixValues.TranslateY],
    };
  };

  const setScale = (kx: number, ky?: number) => {
    "worklet";
    const next = matrix.value.slice(0);
    next[MatrixValues.ScaleX] = kx;
    next[MatrixValues.ScaleY] = ky ?? kx;

    matrix.value = next as unknown as Matrix4;
  };

  const setTranslate = (tx: number, ty: number) => {
    "worklet";
    const next = matrix.value.slice(0);

    next[MatrixValues.TranslateX] = tx;
    next[MatrixValues.TranslateY] = ty;

    matrix.value = next as unknown as Matrix4;
  };

  const _translate = (tx: number, ty: number) => {
    "worklet";

    matrix.value = multiply4(matrix.value, translate(tx, ty));
  };

  const _scale = (kx: number, ky?: number, p?: { x: number; y: number }) => {
    "worklet";

    matrix.value = multiply4(matrix.value, scale(kx, ky ?? kx, 1, p));
  };

  return {
    getTransformComponents: getTransformComponents,
    setScale: setScale,
    setTranslate: setTranslate,
    translate: _translate,
    scale: _scale,
  };
};

type CharTransformActions = {
  setScale: (kx: number, ky?: number) => void;
  setTranslate: (tx: number, ty: number) => void;
  getTransformComponents: () => {
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
  };
  translate: (tx: number, ty: number) => void;
  scale: (kx: number, ky?: number, p?: { x: number; y: number }) => void;
};

export type ChartTransformState = {
  panActive: SharedValue<boolean>;
  zoomActive: SharedValue<boolean>;
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

  return {
    state: {
      panActive: makeMutable(false),
      zoomActive: makeMutable(false),
      origin,
      matrix,
      offset,
    },
    actions: getActions(matrix),
  };
};
