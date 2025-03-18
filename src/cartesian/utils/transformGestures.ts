import {
  Gesture,
  type PanGesture,
  type PinchGesture,
} from "react-native-gesture-handler";
import { multiply4, scale, translate } from "@shopify/react-native-skia";
import type { PanGestureConfig } from "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler";
import type { ChartTransformState } from "../hooks/useChartTransformState";
import {
  withDecay,
  cancelAnimation,
  type SharedValue,
  runOnJS,
} from "react-native-reanimated";

type Dimension = "x" | "y";

export type PinchTransformGestureConfig = {
  enabled?: boolean;
  dimensions?: Dimension | Dimension[];
};
export const pinchTransformGesture = (
  state: ChartTransformState,
  _config: PinchTransformGestureConfig = {},
): PinchGesture => {
  const defaults: PinchTransformGestureConfig = {
    enabled: true,
    dimensions: ["x", "y"],
  };
  const config = { ...defaults, ..._config };
  const dimensions = Array.isArray(config.dimensions)
    ? config.dimensions
    : [config.dimensions];
  const scaleX = dimensions.includes("x");
  const scaleY = dimensions.includes("y");

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
        scale(
          scaleX ? e.scale : 1,
          scaleY ? e.scale : 1,
          1,
          state.origin.value,
        ),
      );
    })
    .onEnd(() => {
      state.zoomActive.value = false;
    });

  return pinch;
};

export type PanTransformGestureConfig = {
  enabled?: boolean;
  dimensions?: Dimension | Dimension[];
} & Pick<PanGestureConfig, "activateAfterLongPress">;
export const panTransformGesture = (
  state: ChartTransformState,
  _config: PanTransformGestureConfig = {},
): PanGesture => {
  const defaults: PanTransformGestureConfig = {
    enabled: true,
    dimensions: ["x", "y"],
  };
  const config = { ...defaults, ..._config };
  const dimensions = Array.isArray(config.dimensions)
    ? config.dimensions
    : [config.dimensions];
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

export const scrollTransformGesture = ({
  scrollX,
  prevTranslateX,
  viewportWidth,
  length,
  dimensions,
  onScroll,
}: {
  scrollX: SharedValue<number>;
  prevTranslateX: SharedValue<number>;
  viewportWidth: number;
  length: number;
  dimensions: Partial<{ totalContentWidth: number; width: number }>;
  onScroll?: (data: any) => void;
}): PanGesture => {
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      cancelAnimation(scrollX);
      prevTranslateX.value = scrollX.value;
    })
    .onUpdate((e) => {
      const viewportWidth = dimensions.width || 300;
      const change = e.translationX / viewportWidth;
      const width = (dimensions.totalContentWidth || 300) + 20;
      const newValue = prevTranslateX.value - e.translationX;
      const maxScroll = width - viewportWidth;
      scrollX.value = Math.max(0, Math.min(maxScroll, newValue));
      if (onScroll) {
        // need to account for viewport zoom some how - TODO
        runOnJS(onScroll)({
          change,
          diff: prevTranslateX.value - newValue,
          scrollX: scrollX.value,
          prevTranslateX: prevTranslateX.value,
          viewportWidth,
          length,
          totalContentWidth: dimensions.totalContentWidth,
        });
      }
    })

    .onEnd((e) => {
      const width = (dimensions.totalContentWidth || 300) + 20;
      const maxScroll = width - viewportWidth + 25;
      scrollX.value = withDecay({
        velocity: -e.velocityX,
        clamp: [0, maxScroll],
      });
    });

  return panGesture;
};
