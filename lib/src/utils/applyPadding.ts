import type { ChartBounds, SidedNumber } from "../types";
import { valueFromSidedNumber } from "./valueFromSidedNumber";

export default function applyPadding(
  bounds: ChartBounds,
  padding: SidedNumber,
) {
  return {
    left:
      bounds.left -
      (typeof padding === "number"
        ? padding
        : valueFromSidedNumber(padding, "left")),
    right:
      bounds.right +
      (typeof padding === "number"
        ? padding
        : valueFromSidedNumber(padding, "right")),
    top:
      bounds.top +
      (typeof padding === "number"
        ? padding
        : valueFromSidedNumber(padding, "top")),
    bottom:
      bounds.bottom -
      (typeof padding === "number"
        ? padding
        : valueFromSidedNumber(padding, "bottom")),
  };
}
