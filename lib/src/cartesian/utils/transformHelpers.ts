import { type SkMatrix } from "@shopify/react-native-skia";

// export const transformOrigin3d = (
//   origin: Vec3,
//   transform: Transforms3d,
// ): Transforms3d => {
//   "worklet";
//   return [
//     { translateX: origin[0] },
//     { translateY: origin[1] },
//     { translateZ: origin[2] },
//     ...transform,
//     { translateX: -origin[0] },
//     { translateY: -origin[1] },
//     { translateZ: -origin[2] },
//   ];
// };

// export const concat = (m: Matrix4, origin: Vec3, transform: Transforms3d) => {
//   "worklet";
//   return multiply4(m, processTransform3d(transformOrigin3d(origin, transform)));
// };

export const decomposeTransformMatrix = (arg: SkMatrix) => {
  "worklet";
  const m = arg.get();
  const translateX = m[2];
  const translateY = m[3 + 2];
  const a = m[0];
  const b = m[3 + 0];
  const c = m[1];
  const d = m[3 + 1];
  const E = (a! + d!) / 2;
  const F = (a! - d!) / 2;
  const G = (c! + b!) / 2;
  const H = (c! - b!) / 2;
  const Q = Math.sqrt(Math.pow(E, 2) + Math.pow(H, 2));
  const R = Math.sqrt(Math.pow(F, 2) + Math.pow(G, 2));
  const scaleX = Q + R;
  const scaleY = Q - R;
  return {
    translateX,
    translateY,
    scaleX,
    scaleY,
  };
};
