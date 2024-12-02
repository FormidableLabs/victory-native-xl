import {
  Gesture,
  type PanGesture,
  type PinchGesture,
} from "react-native-gesture-handler";
import { multiply4, scale, translate } from "@shopify/react-native-skia";
import type { PanGestureConfig } from "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler";
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
    .onStart(() => {
      state.zoomActive.value = true;
    })
    .onChange((e) => {
      state.matrix.value = multiply4(
        state.offset.value,
        scale(e.scale, e.scale, 1, state.origin.value),
      );
    })
    .onEnd(() => {
      state.zoomActive.value = false;
    });

  return pinch;
};

type Dimension = "x" | "y";
export type PanTransformGestureConfig = {
  dimensions?: Dimension | Dimension[];
} & Pick<PanGestureConfig, "activateAfterLongPress">;
export const panTransformGesture = (
  state: ChartTransformState,
  config: PanTransformGestureConfig = {},
): PanGesture => {
  const dimensions = config.dimensions
    ? Array.isArray(config.dimensions)
      ? config.dimensions
      : [config.dimensions]
    : ["x", "y"];
  const panX = dimensions.includes("x");
  const panY = dimensions.includes("y");

  const pan = Gesture.Pan()
    .onStart(() => {
      state.panActive.value = true;
    })
    .onChange((e) => {
      state.matrix.value = multiply4(
        translate(panX ? e.changeX : 0, panY ? e.changeY : 0, 0),
        state.matrix.value,
      );
    })
    .onEnd(() => {
      state.panActive.value = false;
    });

  if (config.activateAfterLongPress !== undefined) {
    pan.activateAfterLongPress(config.activateAfterLongPress);
  }

  return pan;
};
