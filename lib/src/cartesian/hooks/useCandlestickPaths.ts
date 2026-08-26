import * as React from "react";
import {
  Skia,
  type Color,
  type PathProps,
  type SkPath,
  type SkPathBuilder,
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
  bodyBuilder: SkPathBuilder,
  wickBuilder: SkPathBuilder,
) => {
  wickBuilder.moveTo(geometry.wick.x, geometry.wick.y1);
  wickBuilder.lineTo(geometry.wick.x, geometry.wick.y2);

  if (geometry.body.width <= 0 || geometry.body.height <= 0) return;

  bodyBuilder.addRect(
    Skia.XYWHRect(
      geometry.body.x,
      geometry.body.y,
      geometry.body.width,
      geometry.body.height,
    ),
  );
};

type CandlestickPathBuilders = {
  key: string;
  status: CandlestickStatus;
  bodyBuilder: SkPathBuilder;
  wickBuilder: SkPathBuilder;
  bodyOptions: Required<Pick<CandlestickBodyPathOptions, "color">>;
  wickOptions: Required<
    Pick<CandlestickWickPathOptions, "color" | "strokeWidth">
  >;
};

const makeEmptyGroups = (
  candleColors?: CandlestickColors,
  wickStrokeWidth = 1,
): CandlestickPathBuilders[] =>
  (["positive", "negative", "neutral"] as const).map((status) => {
    const color = getStatusColor(status, candleColors);
    return {
      key: status,
      status,
      bodyBuilder: Skia.PathBuilder.Make(),
      wickBuilder: Skia.PathBuilder.Make(),
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
          const bodyBuilder = Skia.PathBuilder.Make();
          const wickBuilder = Skia.PathBuilder.Make();
          addGeometryToPaths(candle, bodyBuilder, wickBuilder);
          const { bodyOptions, wickOptions } = resolveCandlestickPathOptions({
            color,
            wickStrokeWidth,
            options,
          });

          return {
            key: `candlestick-${candle.datumIndex}`,
            geometry: candle,
            bodyPath: bodyBuilder.build(),
            wickPath: wickBuilder.build(),
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
      {} as Record<CandlestickStatus, CandlestickPathBuilders>,
    );

    geometry.forEach((candle) => {
      const group = groupByStatus[candle.status];
      addGeometryToPaths(candle, group.bodyBuilder, group.wickBuilder);
    });

    return {
      mode: "grouped",
      candleWidth,
      geometry,
      groups: groups.map(
        ({ bodyBuilder, wickBuilder, bodyOptions, wickOptions, key, status }) =>
          ({
            key,
            status,
            bodyPath: bodyBuilder.build(),
            wickPath: wickBuilder.build(),
            bodyOptions,
            wickOptions,
          }) satisfies CandlestickPathGroup,
      ),
    };
  }, [candleColors, candleOptions, candleWidth, geometry, wickStrokeWidth]);
};
