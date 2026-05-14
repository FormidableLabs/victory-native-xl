import type { AxisScaleType } from "../../types";

export const getYScaleDomain = ({
  yMin,
  yMax,
  yAxisScale = "linear",
}: {
  yMin: number;
  yMax: number;
  yAxisScale?: AxisScaleType;
}): [number, number] => {
  const fallbackYScaleDomain = yAxisScale === "log" ? [10, 1] : [1, -1];
  const singleValueYScaleDomain =
    yAxisScale === "log" ? [yMax * 10, yMin / 10] : [yMax + 1, yMin - 1];

  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    return fallbackYScaleDomain as [number, number];
  }

  if (yAxisScale === "log" && (yMin <= 0 || yMax <= 0)) {
    return fallbackYScaleDomain as [number, number];
  }

  if (yMax === yMin) {
    return singleValueYScaleDomain as [number, number];
  }

  return [yMax, yMin];
};
