import type { ChartBounds, SidedNumber } from "../types";

export default function applyPadding(
  bounds: ChartBounds,
  padding: SidedNumber,
) {
  const paddedBounds = {
    left:
      bounds.left -
      (typeof padding === "number" ? padding : padding?.left ?? 0),
    right:
      bounds.right +
      (typeof padding === "number" ? padding : padding?.right ?? 0),
    top:
      bounds.top + (typeof padding === "number" ? padding : padding?.top ?? 0),
    bottom:
      bounds.bottom -
      (typeof padding === "number" ? padding : padding?.bottom ?? 0),
  };
  return paddedBounds;
}
