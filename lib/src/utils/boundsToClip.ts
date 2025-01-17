import { rect, type ClipDef } from "@shopify/react-native-skia";
import type { ChartBounds } from "../types";

export const boundsToClip = (bounds: ChartBounds): ClipDef => {
  return rect(
    bounds.left,
    bounds.top,
    bounds.right - bounds.left,
    bounds.bottom - bounds.top,
  );
};
