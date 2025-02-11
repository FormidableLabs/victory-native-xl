import * as React from "react";
import { StyleSheet } from "react-native";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import {
  type ComposedGesture,
  Gesture,
  GestureHandlerRootView,
  type TouchData,
} from "react-native-gesture-handler";
import { type MutableRefObject } from "react";
import type { ScaleLinear } from "d3-scale";
import type {
  InputFields,
  NumericalFields,
  TransformedData,
  ChartBounds,
  ChartPressPanConfig,
  MaybeNumber,
} from "../../types";
import { findClosestPoint } from "../../utils/findClosestPoint";
import { asNumber } from "../../utils/asNumber";
import type { ChartPressState } from "../hooks/useChartPressState";
import { type ChartTransformState } from "../hooks/useChartTransformState";
import {
  panTransformGesture,
  type PanTransformGestureConfig,
  pinchTransformGesture,
  type PinchTransformGestureConfig,
} from "../utils/transformGestures";
import { GestureHandler } from "../../shared/GestureHandler";

import type { CartesianActionsHandle } from "../CartesianChart";

type CartesianGestureHandlerProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = React.PropsWithChildren<{
  actionsRef?: MutableRefObject<CartesianActionsHandle<
    | ChartPressState<{
        x: InputFields<RawData>[XK];
        y: Record<YK, number>;
      }>
    | undefined
  > | null>;
  chartBounds: ChartBounds;
  customGestures?: ComposedGesture;
  chartPressConfig?: {
    pan?: ChartPressPanConfig;
  };
  chartPressState?:
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>[];
  /**
   * @deprecated This prop will eventually be replaced by the new `chartPressConfig`. For now it's being kept around for backwards compatibility sake.
   */
  gestureLongPressDelay?: number;
  primaryYAxis: {
    yScale: ScaleLinear<number, number>;
    yTicksNormalized: number[];
    yData: Record<
      string,
      {
        i: MaybeNumber[];
        o: MaybeNumber[];
      }
    >;
  };
  transformConfig?: {
    pan?: PanTransformGestureConfig;
    pinch?: PinchTransformGestureConfig;
  };
  transformState?: ChartTransformState;
  tData: SharedValue<TransformedData<RawData, XK, YK>>;
  xScale: ScaleLinear<number, number, never>;
  yKeys: YK[];
}>;

export const CartesianGestureHandler = <
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  actionsRef,
  chartBounds,
  chartPressConfig,
  chartPressState,
  children,
  gestureLongPressDelay = 100,
  customGestures,
  primaryYAxis,
  tData,
  transformConfig,
  transformState,
  xScale,
  yKeys,
}: CartesianGestureHandlerProps<RawData, XK, YK>) => {
  const primaryYScale = primaryYAxis.yScale;
  // stacked bar values
  const chartHeight = chartBounds.bottom;
  const yScaleTop = primaryYAxis.yScale.domain().at(0);
  const yScaleBottom = primaryYAxis.yScale.domain().at(-1);
  // end stacked bar values

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number);
  /**
   * Take a "press value" and an x-value and update the shared values accordingly.
   */
  const handleTouch = (
    v: ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>,
    x: number,
    y: number,
  ) => {
    "worklet";
    const idx = findClosestPoint(tData.value.ox, x);

    if (typeof idx !== "number") return;

    const isInYs = (yk: string): yk is YK & string => yKeys.includes(yk as YK);

    // begin stacked bar handling:
    // store the heights of each bar segment
    const barHeights: number[] = [];
    for (const yk in v.y) {
      if (isInYs(yk)) {
        const height = asNumber(tData.value.y[yk].i[idx]);
        barHeights.push(height);
      }
    }

    const chartYPressed = chartHeight - y; // Invert y-coordinate, since RNGH gives us the absolute Y, and we want to know where in the chart they clicked
    // Calculate the actual yValue of the touch within the domain of the yScale
    const yDomainValue =
      (chartYPressed / chartHeight) * (yScaleTop! - yScaleBottom!);

    // track the cumulative height and the y-index of the touched segment
    let cumulativeHeight = 0;
    let yIndex = -1;

    // loop through the bar heights to find which bar was touched
    for (let i = 0; i < barHeights.length; i++) {
      // Accumulate the height as we go along
      cumulativeHeight += barHeights[i]!;
      // Check if the y-value touched falls within the current segment
      if (yDomainValue <= cumulativeHeight) {
        // If it does, set yIndex to the current segment index and break
        yIndex = i;
        break;
      }
    }

    // Update the yIndex value in the state or context
    v.yIndex.value = yIndex;
    // end stacked bar handling

    if (v) {
      try {
        v.matchedIndex.value = idx;
        v.x.value.value = tData.value.ix[idx]!;
        v.x.position.value = asNumber(tData.value.ox[idx]);
        for (const yk in v.y) {
          if (isInYs(yk)) {
            v.y[yk].value.value = asNumber(tData.value.y[yk].i[idx]);
            v.y[yk].position.value = asNumber(tData.value.y[yk].o[idx]);
          }
        }
      } catch (err) {
        // no-op
      }
    }

    lastIdx.value = idx;
  };

  if (actionsRef) {
    actionsRef.current = {
      handleTouch,
    };
  }

  /**
   * Touch gesture is a modified Pan gesture handler that allows for multiple presses:
   * - Using Pan Gesture handler effectively _just_ for the .activateAfterLongPress functionality.
   * - Tracking the finger is handled with .onTouchesMove instead of .onUpdate, because
   *    .onTouchesMove gives us access to each individual finger.
   * - The activation gets a bit complicated because we want to wait til "start" state before updating Press Value
   *    which gives time for the gesture to get cancelled before we start updating the shared values.
   *    Therefore we use gestureState.bootstrap to store some "bootstrap" information if gesture isn't active when finger goes down.
   */
  // touch ID -> value index mapping to keep track of which finger updates which value
  const touchMap = useSharedValue({} as Record<number, number | undefined>);
  const activePressSharedValues = Array.isArray(chartPressState)
    ? chartPressState
    : [chartPressState];
  const gestureState = useSharedValue({
    isGestureActive: false,
    bootstrap: [] as [
      ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>,
      TouchData,
    ][],
  });

  const panGesture = Gesture.Pan()
    /**
     * When a finger goes down, either update the state or store in the bootstrap array.
     */
    .onTouchesDown((e) => {
      const vals = activePressSharedValues || [];
      if (!vals.length || e.numberOfTouches === 0) return;

      for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
        const touch = e.allTouches[i];
        const v = vals[i];
        if (!v || !touch) continue;

        if (gestureState.value.isGestureActive) {
          // Update the mapping
          if (typeof touchMap.value[touch.id] !== "number")
            touchMap.value[touch.id] = i;

          v.isActive.value = true;
          handleTouch(v, touch.x, touch.y);
        } else {
          gestureState.value.bootstrap.push([v, touch]);
        }
      }
    })
    /**
     * On start, check if we have any bootstraped updates we need to apply.
     */
    .onStart(() => {
      gestureState.value.isGestureActive = true;

      for (let i = 0; i < gestureState.value.bootstrap.length; i++) {
        const [v, touch] = gestureState.value.bootstrap[i]!;
        // Update the mapping
        if (typeof touchMap.value[touch.id] !== "number")
          touchMap.value[touch.id] = i;

        v.isActive.value = true;
        handleTouch(v, touch.x, touch.y);
      }
    })
    /**
     * Clear gesture state on gesture end.
     */
    .onFinalize(() => {
      gestureState.value.isGestureActive = false;
      gestureState.value.bootstrap = [];
    })
    /**
     * As fingers move, update the shared values accordingly.
     */
    .onTouchesMove((e) => {
      const vals = activePressSharedValues || [];
      if (!vals.length || e.numberOfTouches === 0) return;

      for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
        const touch = e.allTouches[i];
        const touchId = touch?.id;
        const idx = typeof touchId === "number" && touchMap.value[touchId];
        const v = typeof idx === "number" && vals?.[idx];

        if (!v || !touch) continue;
        if (!v.isActive.value) v.isActive.value = true;
        handleTouch(v, touch.x, touch.y);
      }
    })
    /**
     * On each finger up, start to update values and "free up" the touch map.
     */
    .onTouchesUp((e) => {
      for (const touch of e.changedTouches) {
        const vals = activePressSharedValues || [];

        // Set active state to false
        const touchId = touch?.id;
        const idx = typeof touchId === "number" && touchMap.value[touchId];
        const val = typeof idx === "number" && vals[idx];
        if (val) {
          val.isActive.value = false;
        }

        // Free up touch map for this touch
        touchMap.value[touch.id] = undefined;
      }
    })
    /**
     * Once the gesture ends, ensure all active values are falsified.
     */
    .onEnd(() => {
      const vals = activePressSharedValues || [];
      // Set active state to false for all vals
      for (const val of vals) {
        if (val) {
          val.isActive.value = false;
        }
      }
    });

  if (!chartPressConfig?.pan) {
    /**
     * Activate after a long press, which helps with preventing all touch hijacking.
     * This is important if this chart is inside of some sort of scrollable container.
     */
    panGesture.activateAfterLongPress(gestureLongPressDelay);
  }

  if (chartPressConfig?.pan?.activateAfterLongPress) {
    panGesture.activateAfterLongPress(
      chartPressConfig.pan?.activateAfterLongPress,
    );
  }
  if (chartPressConfig?.pan?.activeOffsetX) {
    panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetX);
  }
  if (chartPressConfig?.pan?.activeOffsetY) {
    panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetY);
  }
  if (chartPressConfig?.pan?.failOffsetX) {
    panGesture.failOffsetX(chartPressConfig.pan.failOffsetX);
  }
  if (chartPressConfig?.pan?.failOffsetY) {
    panGesture.failOffsetX(chartPressConfig.pan.failOffsetY);
  }

  let composed = customGestures ?? Gesture.Race();
  if (transformState) {
    if (transformConfig?.pinch?.enabled ?? true) {
      composed = Gesture.Race(
        composed,
        pinchTransformGesture(transformState, transformConfig?.pinch),
      );
    }
    if (transformConfig?.pan?.enabled ?? true) {
      composed = Gesture.Race(
        composed,
        panTransformGesture(transformState, transformConfig?.pan),
      );
    }
  }
  if (chartPressState) {
    composed = Gesture.Race(composed, panGesture);
  }

  const xMin = xScale.range()[0] ?? 0;
  const xMax = xScale.range()[1] ?? 0;
  const yMin = primaryYScale.range()[0] ?? 0;
  const yMax = primaryYScale.range()[1] ?? 0;

  const dimensions = {
    x: Math.min(xMin, 0),
    y: Math.min(yMin, 0),
    width: xMax - Math.min(xMin, 0),
    height: yMax - Math.min(yMin, 0),
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {children}
      <GestureHandler
        gesture={composed}
        transformState={transformState}
        dimensions={dimensions}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});
