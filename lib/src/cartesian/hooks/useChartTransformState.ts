import {
  makeMutable,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { type Matrix4 } from "@shopify/react-native-skia";
import { identity4 } from "../../utils/transform";

export type ChartTransformState = {
  panActive: SharedValue<boolean>;
  zoomActive: SharedValue<boolean>;
  origin: SharedValue<{ x: number; y: number }>;
  matrix: SharedValue<Matrix4>;
  offset: SharedValue<Matrix4>;
};

export const useChartTransformState = (): {
  state: ChartTransformState;
} => {
  const origin = useSharedValue({ x: 0, y: 0 });
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  return {
    state: {
      panActive: makeMutable(false),
      zoomActive: makeMutable(false),
      origin,
      matrix,
      offset,
    },
  };
};
