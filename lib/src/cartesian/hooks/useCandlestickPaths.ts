import * as React from "react";
import {
  Skia,
  type Color,
  type PathProps,
  type SkPath,
} from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import { getBarWidth } from "../utils/getBarWidth";
import {
  getCandlestickGeometry,
  type CandlestickGeometry,
  type CandlestickStatus,
} from "../utils/getCandlestickGeometry";
import { resolveCandlestickPathOptions } from "../utils/resolveCandlestickPathOptions";

export type CandlestickColors = {
  positive?: Color;
  negative?: Color;
  neutral?: Color;
};

export type CandlestickBodyPathOptions = Partial<
  Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">
> & {
  children?: React.ReactNode;
};

export type CandlestickWickPathOptions = Partial<
  Pick<
    PathProps,
    | "color"
    | "blendMode"
    | "opacity"
    | "antiAlias"
    | "strokeWidth"
    | "strokeCap"
  >
> & {
  children?: React.ReactNode;
};

export type CandlestickOptions = {
  body?: CandlestickBodyPathOptions;
  wick?: CandlestickWickPathOptions;
};

export type CandlestickOptionsContext = CandlestickGeometry & {
  isPositive: boolean;
  isNegative: boolean;
  isNeutral: boolean;
};

export type CandlestickOptionsFn = (
  context: CandlestickOptionsContext,
) => CandlestickOptions;

export type CandlestickPathGroup = {
  key: string;
  status: CandlestickStatus;
  bodyPath: SkPath;
  wickPath: SkPath;
  bodyOptions: Required<Pick<CandlestickBodyPathOptions, "color">>;
  wickOptions: Required<
    Pick<CandlestickWickPathOptions, "color" | "strokeWidth">
  >;
};

export type CustomCandlestickPath = {
  key: string;
  geometry: CandlestickGeometry;
  bodyPath: SkPath;
  wickPath: SkPath;
  bodyOptions: CandlestickBodyPathOptions;
  wickOptions: CandlestickWickPathOptions;
};

export type UseCandlestickPathsResult =
  | {
      mode: "grouped";
      candleWidth: number;
      geometry: CandlestickGeometry[];
      groups: CandlestickPathGroup[];
    }
  | {
      mode: "custom";
      candleWidth: number;
      geometry: CandlestickGeometry[];
      candles: CustomCandlestickPath[];
    };

export type UseCandlestickPathsArgs = {
  openPoints: PointsArray;
  highPoints: PointsArray;
  lowPoints: PointsArray;
  closePoints: PointsArray;
  chartBounds: ChartBounds;
  candleWidth?: number;
  candleRatio?: number;
  candleCount?: number;
  minBodyHeight?: number;
  candleColors?: CandlestickColors;
  wickStrokeWidth?: number;
  candleOptions?: CandlestickOptionsFn;
};

const DEFAULT_CANDLE_COLORS = {
  positive: "#26a69a",
  negative: "#ef5350",
  neutral: "#737375",
} satisfies Record<CandlestickStatus, Color>;

const clampCandleRatio = (candleRatio: number) =>
  Math.max(0, Math.min(1, candleRatio));

const getOptionsContext = (
  geometry: CandlestickGeometry,
): CandlestickOptionsContext => ({
  ...geometry,
  isPositive: geometry.status === "positive",
  isNegative: geometry.status === "negative",
  isNeutral: geometry.status === "neutral",
});

const getStatusColor = (
  status: CandlestickStatus,
  candleColors?: CandlestickColors,
) => candleColors?.[status] ?? DEFAULT_CANDLE_COLORS[status];

const addGeometryToPaths = (
  geometry: CandlestickGeometry,
  bodyPath: SkPath,
  wickPath: SkPath,
) => {
  wickPath.moveTo(geometry.wick.x, geometry.wick.y1);
  wickPath.lineTo(geometry.wick.x, geometry.wick.y2);

  if (geometry.body.width <= 0 || geometry.body.height <= 0) return;

  bodyPath.addRect(
    Skia.XYWHRect(
      geometry.body.x,
      geometry.body.y,
      geometry.body.width,
      geometry.body.height,
    ),
  );
};

const makeEmptyGroups = (
  candleColors?: CandlestickColors,
  wickStrokeWidth = 1,
) =>
  (["positive", "negative", "neutral"] as const).map((status) => {
    const color = getStatusColor(status, candleColors);
    return {
      key: status,
      status,
      bodyPath: Skia.Path.Make(),
      wickPath: Skia.Path.Make(),
      bodyOptions: { color },
      wickOptions: { color, strokeWidth: wickStrokeWidth },
    };
  });

export const useCandlestickPaths = ({
  openPoints,
  highPoints,
  lowPoints,
  closePoints,
  chartBounds,
  candleWidth: customCandleWidth,
  candleRatio = 0.6,
  candleCount,
  minBodyHeight = 1,
  candleColors,
  wickStrokeWidth = 1,
  candleOptions,
}: UseCandlestickPathsArgs): UseCandlestickPathsResult => {
  const normalizedCandleRatio = clampCandleRatio(candleRatio);
  const candleWidth = getBarWidth({
    points: openPoints,
    chartBounds,
    innerPadding: 1 - normalizedCandleRatio,
    customBarWidth: customCandleWidth,
    barCount: candleCount,
  });

  const geometry = React.useMemo(
    () =>
      getCandlestickGeometry({
        openPoints,
        highPoints,
        lowPoints,
        closePoints,
        candleWidth,
        minBodyHeight,
      }),
    [
      candleWidth,
      closePoints,
      highPoints,
      lowPoints,
      minBodyHeight,
      openPoints,
    ],
  );

  return React.useMemo(() => {
    if (candleOptions) {
      return {
        mode: "custom",
        candleWidth,
        geometry,
        candles: geometry.map((candle) => {
          const color = getStatusColor(candle.status, candleColors);
          const options = candleOptions(getOptionsContext(candle));
          const bodyPath = Skia.Path.Make();
          const wickPath = Skia.Path.Make();
          addGeometryToPaths(candle, bodyPath, wickPath);
          const { bodyOptions, wickOptions } = resolveCandlestickPathOptions({
            color,
            wickStrokeWidth,
            options,
          });

          return {
            key: `candlestick-${candle.datumIndex}`,
            geometry: candle,
            bodyPath,
            wickPath,
            bodyOptions,
            wickOptions,
          };
        }),
      };
    }

    const groups = makeEmptyGroups(candleColors, wickStrokeWidth);
    const groupByStatus = groups.reduce(
      (acc, group) => {
        acc[group.status] = group;
        return acc;
      },
      {} as Record<CandlestickStatus, CandlestickPathGroup>,
    );

    geometry.forEach((candle) => {
      const group = groupByStatus[candle.status];
      addGeometryToPaths(candle, group.bodyPath, group.wickPath);
    });

    return {
      mode: "grouped",
      candleWidth,
      geometry,
      groups,
    };
  }, [candleColors, candleOptions, candleWidth, geometry, wickStrokeWidth]);
};
