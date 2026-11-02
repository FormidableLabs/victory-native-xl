import type { PieSliceData } from "../PieSlice";
import type { PolarHoverPointer } from "../../polar/contexts/PolarChartContext";

export const getHoveredPieSliceIndex = ({
  pointer,
  center,
  radius,
  circleSweepDegrees,
  startAngle,
  slices,
}: {
  pointer: PolarHoverPointer;
  center: { x: number; y: number };
  radius: number;
  circleSweepDegrees: number;
  startAngle: number;
  slices: PieSliceData[];
}) => {
  "worklet";
  if (!pointer) return -1;

  const dx = pointer.x - center.x;
  const dy = pointer.y - center.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > radius) return -1;

  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angle < 0) angle += 360;
  // Pointer angle relative to the chart's start angle, wrapped into
  // [0, 360) so it can be compared against unwrapped slice angles.
  let rel = angle - startAngle;
  rel = ((rel % 360) + 360) % 360;
  if (rel > circleSweepDegrees) return -1;

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    if (!slice) continue;
    if (dist < slice.innerRadius || dist > slice.radius) continue;
    const sliceStart = slice.startAngle - startAngle;
    if (rel >= sliceStart && rel <= sliceStart + slice.sweepAngle) {
      return i;
    }
  }

  return -1;
};
