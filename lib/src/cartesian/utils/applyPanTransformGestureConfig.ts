import type { PanGesture } from "react-native-gesture-handler";

type Dimension = "x" | "y";
type ExtractSingleParam<T> = T extends (arg: infer P) => unknown ? P : never;

export type PanTransformGestureConfig = {
  enabled?: boolean;
  dimensions?: Dimension | Dimension[];
  activateAfterLongPress?: ExtractSingleParam<
    PanGesture["activateAfterLongPress"]
  >;
  activeOffsetX?: ExtractSingleParam<PanGesture["activeOffsetX"]>;
  activeOffsetY?: ExtractSingleParam<PanGesture["activeOffsetY"]>;
  failOffsetX?: ExtractSingleParam<PanGesture["failOffsetX"]>;
  failOffsetY?: ExtractSingleParam<PanGesture["failOffsetY"]>;
};

type PanTransformGesture = {
  activateAfterLongPress: (
    delay: NonNullable<PanTransformGestureConfig["activateAfterLongPress"]>,
  ) => void;
  activeOffsetX: (
    offset: NonNullable<PanTransformGestureConfig["activeOffsetX"]>,
  ) => void;
  activeOffsetY: (
    offset: NonNullable<PanTransformGestureConfig["activeOffsetY"]>,
  ) => void;
  failOffsetX: (
    offset: NonNullable<PanTransformGestureConfig["failOffsetX"]>,
  ) => void;
  failOffsetY: (
    offset: NonNullable<PanTransformGestureConfig["failOffsetY"]>,
  ) => void;
};

export const applyPanTransformGestureConfig = ({
  panGesture,
  panConfig,
}: {
  panGesture: PanTransformGesture;
  panConfig: PanTransformGestureConfig;
}) => {
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
