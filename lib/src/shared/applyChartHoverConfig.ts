import type { HoverGesture, PanGesture } from "./gestureTypes";
import type { ChartHoverConfig } from "../types";

type ChartHoverExternalGesture = Parameters<
  PanGesture["simultaneousWithExternalGesture"]
>[number];

type ChartHoverGesture = {
  activeCursor: (
    cursor: Parameters<HoverGesture["activeCursor"]>[number],
  ) => void;
  simultaneousWithExternalGesture: (
    ...gestures: ChartHoverExternalGesture[]
  ) => void;
};

export const applyChartHoverConfig = ({
  gesture,
  hoverConfig,
}: {
  gesture: ChartHoverGesture;
  hoverConfig?: ChartHoverConfig;
}) => {
  if (hoverConfig?.activeCursor) {
    gesture.activeCursor(hoverConfig.activeCursor);
  }

  if (hoverConfig?.simultaneousWithExternalGesture) {
    const externalGestures = Array.isArray(
      hoverConfig.simultaneousWithExternalGesture,
    )
      ? hoverConfig.simultaneousWithExternalGesture
      : [hoverConfig.simultaneousWithExternalGesture];
    gesture.simultaneousWithExternalGesture(...externalGestures);
  }
};
