import type { ChartPressPanConfig } from "../../types";

type ArrayItem<T> = T extends readonly (infer Item)[] ? Item : T;
type ChartPressExternalGesture = ArrayItem<
  NonNullable<ChartPressPanConfig["simultaneousWithExternalGesture"]>
>;

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
  simultaneousWithExternalGesture: (
    ...gestures: ChartPressExternalGesture[]
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
  if (panConfig.simultaneousWithExternalGesture !== undefined) {
    const gestures = Array.isArray(panConfig.simultaneousWithExternalGesture)
      ? panConfig.simultaneousWithExternalGesture
      : [panConfig.simultaneousWithExternalGesture];
    panGesture.simultaneousWithExternalGesture(...gestures);
  }
};
