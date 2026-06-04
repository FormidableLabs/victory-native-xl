import React from "react";
import { Candlestick, CartesianChart } from "victory-native";

const DATA = [
  { day: 1, open: 10, high: 18, low: 6, close: 15 },
  { day: 2, open: 15, high: 20, low: 9, close: 11 },
  { day: 3, open: 12, high: 17, low: 8, close: 12 },
  { day: 4, open: 12, high: 22, low: 10, close: 19 },
] as const;

const WIDTH = 400;
const HEIGHT = 250;

export const candlestickCartesianChart = (
  <CartesianChart
    data={[...DATA]}
    xKey="day"
    yKeys={["open", "high", "low", "close"]}
    domain={{ y: [0, 24] }}
    domainPadding={{ left: 30, right: 30 }}
    explicitSize={{ width: WIDTH, height: HEIGHT }}
    headless
    frame={{
      lineWidth: 1,
      lineColor: "#000000",
    }}
    xAxis={{
      tickCount: 4,
      lineWidth: 1,
      lineColor: "#333333",
    }}
    yAxis={[
      {
        yKeys: ["open", "high", "low", "close"],
        tickCount: 3,
        lineWidth: 1,
        lineColor: "#333333",
      },
    ]}
  >
    {({ points, chartBounds }) => (
      <Candlestick
        openPoints={points.open}
        highPoints={points.high}
        lowPoints={points.low}
        closePoints={points.close}
        chartBounds={chartBounds}
        candleRatio={0.55}
        wickStrokeWidth={2}
        candleColors={{
          positive: "#15803d",
          negative: "#b91c1c",
          neutral: "#52525b",
        }}
      />
    )}
  </CartesianChart>
);

export const candlestickCartesianSize = { width: WIDTH, height: HEIGHT };
