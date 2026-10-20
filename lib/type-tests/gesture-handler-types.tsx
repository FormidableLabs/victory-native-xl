import React from "react";
import { Gesture } from "react-native-gesture-handler";
import { CartesianChart, type ChartPressPanConfig } from "victory-native";
import type { GestureHandlerConfig } from "../src/types";
import {
  panTransformGesture,
  pinchTransformGesture,
} from "../src/cartesian/utils/transformGestures";
import type { ChartTransformState } from "../src/cartesian/hooks/useChartTransformState";

// Run against both RNGH 2 and 3: their builder type export names differ.
export function GestureHandlerTypes({ state }: { state: ChartTransformState }) {
  const pan: ReturnType<typeof Gesture.Pan> = panTransformGesture(state, {
    activeOffsetX: [-20, 20],
    failOffsetY: [-12, 12],
  });
  const pinch: ReturnType<typeof Gesture.Pinch> = pinchTransformGesture(state);
  const external = Gesture.Native();
  const press: ChartPressPanConfig = {
    activateAfterLongPress: 120,
    simultaneousWithExternalGesture: [external, pan],
  };
  const config: GestureHandlerConfig = {
    userSelect: "none",
    touchAction: "pan-y",
    enableContextMenu: false,
  };

  return (
    <CartesianChart
      data={[{ x: 1, y: 2 }]}
      xKey="x"
      yKeys={["y"]}
      customGestures={Gesture.Race(
        Gesture.Simultaneous(pan, pinch),
        Gesture.Exclusive(Gesture.Tap(), Gesture.LongPress()),
      )}
      chartPressConfig={{ pan: press }}
      gestureHandlerConfig={config}
      transformState={state}
    >
      {() => null}
    </CartesianChart>
  );
}
