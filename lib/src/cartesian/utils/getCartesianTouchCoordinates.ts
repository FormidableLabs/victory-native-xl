import type { SkRect } from "@shopify/react-native-skia";

type TouchPoint = {
  x?: number;
  y?: number;
  absoluteX?: number;
  absoluteY?: number;
};

type ChartTouchPoint = {
  x: number;
  y: number;
};

const finiteOrFallback = (
  value: number | undefined,
  fallback: number | undefined,
) => {
  "worklet";

  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof fallback === "number" && Number.isFinite(fallback)) {
    return fallback;
  }
  return 0;
};

export const getCartesianTouchCoordinates = ({
  touch,
  gestureBounds,
}: {
  touch: TouchPoint;
  gestureBounds: Pick<SkRect, "x" | "y">;
}): ChartTouchPoint => {
  "worklet";

  // `handleTouch` compares against canvas-space positions from `tData`.
  // RNGH `touch.x/y` are local to the gesture handler; `gestureBounds` shifts
  // that local space back into the chart canvas when the handler starts < 0.
  return {
    x: finiteOrFallback(touch.x, touch.absoluteX) + gestureBounds.x,
    y: finiteOrFallback(touch.y, touch.absoluteY) + gestureBounds.y,
  };
};
