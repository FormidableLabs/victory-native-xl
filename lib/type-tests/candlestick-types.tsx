import * as React from "react";
import {
  Candlestick,
  CartesianChart,
  useCandlestickPaths,
  type CandlestickOptionsContext,
  type ChartBounds,
  type PointsArray,
} from "victory-native";

type Datum = {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const DATA: Datum[] = [
  { date: 1, open: 10, high: 15, low: 8, close: 12 },
  { date: 2, open: 12, high: 16, low: 9, close: 11 },
];

const CHART_BOUNDS: ChartBounds = {
  left: 0,
  right: 100,
  top: 0,
  bottom: 100,
};

const POINTS: PointsArray = [
  { x: 10, xValue: 1, y: 40, yValue: 12 },
  { x: 20, xValue: 2, y: 50, yValue: 11 },
];

const getOpacity = ({
  datumIndex,
  status,
  isPositive,
  isNegative,
  isNeutral,
  open,
  high,
  low,
  close,
  body,
  wick,
}: CandlestickOptionsContext) => {
  const hasValidStatus =
    status === "positive" || status === "negative" || status === "neutral";
  const hasDirection = isPositive || isNegative || isNeutral;
  const hasValues =
    high >= Math.max(open, close) && low <= Math.min(open, close);
  const hasGeometry = body.width >= 0 && wick.y2 >= wick.y1;

  return hasValidStatus && hasDirection && hasValues && hasGeometry
    ? 1
    : datumIndex;
};

export function CandlestickFromCartesianRenderArgs() {
  return (
    <CartesianChart
      data={DATA}
      xKey="date"
      yKeys={["open", "high", "low", "close"]}
    >
      {({ points, chartBounds }) => (
        <Candlestick
          openPoints={points.open}
          highPoints={points.high}
          lowPoints={points.low}
          closePoints={points.close}
          chartBounds={chartBounds}
          candleColors={{
            positive: "#16a34a",
            negative: "#dc2626",
            neutral: "#71717a",
          }}
          candleOptions={(context) => ({
            body: { opacity: getOpacity(context) },
            wick: {
              strokeWidth: context.isNeutral ? 2 : 1,
              opacity: getOpacity(context),
            },
          })}
        />
      )}
    </CartesianChart>
  );
}

export function UseCandlestickPathsOptionsFields() {
  useCandlestickPaths({
    openPoints: POINTS,
    highPoints: POINTS,
    lowPoints: POINTS,
    closePoints: POINTS,
    chartBounds: CHART_BOUNDS,
    candleRatio: 0.5,
    candleCount: 10,
    candleOptions: (context) => ({
      body: {
        color: context.isPositive ? "#16a34a" : "#dc2626",
      },
      wick: {
        color: context.isNeutral ? "#71717a" : undefined,
        strokeWidth: context.datumIndex + 1,
      },
    }),
  });

  return null;
}
