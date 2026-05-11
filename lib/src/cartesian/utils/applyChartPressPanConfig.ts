import type { ChartPressPanConfig } from "../../types";

type ChartPressPanGesture = {
  activateAfterLongPress: (
    delay: NonNullable<ChartPressPanConfig["activateAfterLongPress"]>,
  ) => void;
  activeOffsetX: (
    offset: NonNullable<ChartPressPanConfig["activeOffsetX"]>,
  ) => void;
  activeOffsetY: (
    offset: NonNullable<ChartPressPanConfig["activeOffsetY"]>,
  ) => void;
  failOffsetX: (
    offset: NonNullable<ChartPressPanConfig["failOffsetX"]>,
  ) => void;
  failOffsetY: (
    offset: NonNullable<ChartPressPanConfig["failOffsetY"]>,
  ) => void;
};

export const applyChartPressPanConfig = ({
  panGesture,
  panConfig,
  gestureLongPressDelay,
}: {
  panGesture: ChartPressPanGesture;
  panConfig?: ChartPressPanConfig;
  gestureLongPressDelay: number;
}) => {
  if (!panConfig) {
    panGesture.activateAfterLongPress(gestureLongPressDelay);
    return;
  }

  if (panConfig.activateAfterLongPress) {
    panGesture.activateAfterLongPress(panConfig.activateAfterLongPress);
  }
  if (panConfig.activeOffsetX) {
    panGesture.activeOffsetX(panConfig.activeOffsetX);
  }
  if (panConfig.activeOffsetY) {
    panGesture.activeOffsetY(panConfig.activeOffsetY);
  }
  if (panConfig.failOffsetX) {
    panGesture.failOffsetX(panConfig.failOffsetX);
  }
  if (panConfig.failOffsetY) {
    panGesture.failOffsetY(panConfig.failOffsetY);
  }
};
