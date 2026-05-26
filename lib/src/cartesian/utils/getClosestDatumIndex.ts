import type { CartesianChartOrientation } from "../../types";
import { findClosestPoint } from "../../utils/findClosestPoint";

export const getClosestDatumIndex = ({
  orientation,
  categoryPositions,
  touchX,
  touchY,
}: {
  orientation: CartesianChartOrientation;
  categoryPositions: number[];
  touchX: number;
  touchY: number;
}) => {
  "worklet";
  return findClosestPoint(
    categoryPositions,
    orientation === "horizontal" ? touchY : touchX,
  );
};
