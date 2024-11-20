import type { Matrix4 } from "@shopify/react-native-skia";

export const identity4: Matrix4 = [
  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
];

enum MatrixValues {
  ScaleX = 0,
  ScaleY = 5,
  TranslateX = 3,
  TranslateY = 7,
}

export const getTransformComponents = (m: Matrix4) => {
  "worklet";

  return {
    scaleX: m[MatrixValues.ScaleX],
    scaleY: m[MatrixValues.ScaleY],
    translateX: m[MatrixValues.TranslateX],
    translateY: m[MatrixValues.TranslateY],
  };
};

export const setScale = (matrix: Matrix4, kx: number, ky?: number): Matrix4 => {
  "worklet";

  const m = matrix.slice(0);
  m[MatrixValues.ScaleX] = kx;
  m[MatrixValues.ScaleY] = ky ?? kx;

  return m as unknown as Matrix4;
};

export const setTranslate = (
  matrix: Matrix4,
  tx: number,
  ty: number,
): Matrix4 => {
  "worklet";

  const m = matrix.slice(0);
  m[MatrixValues.TranslateX] = tx;
  m[MatrixValues.TranslateY] = ty;

  return m as unknown as Matrix4;
};
