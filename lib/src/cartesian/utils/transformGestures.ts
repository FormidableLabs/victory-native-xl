import {
  Gesture,
  type PanGesture,
  type PinchGesture,
} from "react-native-gesture-handler";
import { multiply4, scale, translate } from "@shopify/react-native-skia";
import { type ChartTransformState } from "../hooks/useChartTransformState";

export const pinchTransformGesture = (
  state: ChartTransformState,
): PinchGesture => {
  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      state.offset.value = state.matrix.value;
      state.origin.value = {
        x: e.focalX,
        y: e.focalY,
      };
    })
    .onChange((e) => {
      state.matrix.value = multiply4(
        state.offset.value,
        scale(e.scale, e.scale, 1, state.origin.value),
      );
    });

  return pinch;
};

export const panTransformGesture = (state: ChartTransformState): PanGesture => {
  const pan = Gesture.Pan().onChange((e) => {
    state.matrix.value = multiply4(
      translate(e.changeX, e.changeY, 0),
      state.matrix.value,
    );
  });

  return pan;
};
