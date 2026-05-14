import type { PanGesture } from "react-native-gesture-handler";
import type { ChartPressPanConfig } from "../../types";

type ChartPressPanGesture = Pick<
  PanGesture,
  | "activateAfterLongPress"
  | "activeOffsetX"
  | "activeOffsetY"
  | "failOffsetX"
  | "failOffsetY"
>;

type ApplyChartPressPanConfigArgs = {
  panGesture: ChartPressPanGesture;
  panConfig: ChartPressPanConfig | undefined;
  gestureLongPressDelay: number;
};

export const applyChartPressPanConfig = ({
  panGesture,
  panConfig,
  gestureLongPressDelay,
}: ApplyChartPressPanConfigArgs) => {
  if (!panConfig) {
    panGesture.activateAfterLongPress(gestureLongPressDelay);
    return;
  }

  if (panConfig.activateAfterLongPress !== undefined) {
    panGesture.activateAfterLongPress(panConfig.activateAfterLongPress);
  }
  if (panConfig.activeOffsetX !== undefined) {
    panGesture.activeOffsetX(panConfig.activeOffsetX);
  }
  if (panConfig.activeOffsetY !== undefined) {
    panGesture.activeOffsetY(panConfig.activeOffsetY);
  }
  if (panConfig.failOffsetX !== undefined) {
    panGesture.failOffsetX(panConfig.failOffsetX);
  }
  if (panConfig.failOffsetY !== undefined) {
    panGesture.failOffsetY(panConfig.failOffsetY);
  }
};
