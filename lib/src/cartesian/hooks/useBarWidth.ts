import type { ChartBounds, PointsArray } from "../../types";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";
import { getBarWidth } from "../utils/getBarWidth";

type Props = {
  points: PointsArray | PointsArray[];
  chartBounds: ChartBounds;
  innerPadding: number;
  roundedCorners?: RoundedCorners;
  customBarWidth?: number;
  barCount?: number;
};
export const useBarWidth = ({
  customBarWidth,
  chartBounds,
  innerPadding,
  barCount,
  points,
}: Props) => {
  return getBarWidth({
    customBarWidth,
    chartBounds,
    innerPadding,
    barCount,
    points,
  });
};
