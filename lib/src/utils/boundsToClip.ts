import { rect, type ClipDef } from "@shopify/react-native-skia";
import type { ChartBounds, SidedNumber } from "../types";

export const boundsToClip = (
  bounds: ChartBounds,
  domainPadding: SidedNumber | undefined,
): ClipDef =>
  rect(
    bounds.left,
    bounds.top,
    (bounds.right + typeof domainPadding === "number"
      ? domainPadding
      : domainPadding?.right) -
      (bounds.left - typeof domainPadding === "number"
        ? domainPadding
        : domainPadding?.left),
    bounds.bottom - bounds.top,
  );
