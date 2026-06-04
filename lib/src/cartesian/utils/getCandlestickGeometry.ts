import type { PointsArray } from "../../types";

type Point = PointsArray[number];

export type CandlestickStatus = "positive" | "negative" | "neutral";

export type CandlestickRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CandlestickLine = {
  x: number;
  y1: number;
  y2: number;
};

export type CandlestickGeometry = {
  datumIndex: number;
  x: number;
  xValue: Point["xValue"];
  open: number;
  high: number;
  low: number;
  close: number;
  openY: number;
  highY: number;
  lowY: number;
  closeY: number;
  status: CandlestickStatus;
  body: CandlestickRect;
  wick: CandlestickLine;
};

export type GetCandlestickGeometryArgs = {
  openPoints: PointsArray;
  highPoints: PointsArray;
  lowPoints: PointsArray;
  closePoints: PointsArray;
  candleWidth: number;
  minBodyHeight?: number;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const getNumericValue = (point: Point | undefined) => {
  if (!point || !isFiniteNumber(point.y) || !isFiniteNumber(point.yValue)) {
    return null;
  }

  return { y: point.y, value: point.yValue };
};

const getStatus = (open: number, close: number): CandlestickStatus => {
  if (close > open) return "positive";
  if (close < open) return "negative";
  return "neutral";
};

export const getCandlestickGeometry = ({
  openPoints,
  highPoints,
  lowPoints,
  closePoints,
  candleWidth,
  minBodyHeight = 1,
}: GetCandlestickGeometryArgs): CandlestickGeometry[] => {
  const length = Math.min(
    openPoints.length,
    highPoints.length,
    lowPoints.length,
    closePoints.length,
  );
  const normalizedCandleWidth = Math.max(0, candleWidth);
  const normalizedMinBodyHeight = Math.max(0, minBodyHeight);
  const geometry: CandlestickGeometry[] = [];

  for (let datumIndex = 0; datumIndex < length; datumIndex++) {
    const openPoint = openPoints[datumIndex];
    const highPoint = highPoints[datumIndex];
    const lowPoint = lowPoints[datumIndex];
    const closePoint = closePoints[datumIndex];

    if (!openPoint || !isFiniteNumber(openPoint.x)) continue;

    const open = getNumericValue(openPoint);
    const high = getNumericValue(highPoint);
    const low = getNumericValue(lowPoint);
    const close = getNumericValue(closePoint);

    if (!open || !high || !low || !close) continue;

    const rawBodyTop = Math.min(open.y, close.y);
    const rawBodyBottom = Math.max(open.y, close.y);
    const rawBodyHeight = rawBodyBottom - rawBodyTop;
    const bodyHeight =
      rawBodyHeight > 0
        ? Math.max(rawBodyHeight, normalizedMinBodyHeight)
        : normalizedMinBodyHeight;
    const bodyCenterY = (open.y + close.y) / 2;
    const bodyY = bodyCenterY - bodyHeight / 2;
    const wickY1 = Math.min(high.y, low.y);
    const wickY2 = Math.max(high.y, low.y);

    geometry.push({
      datumIndex,
      x: openPoint.x,
      xValue: openPoint.xValue,
      open: open.value,
      high: high.value,
      low: low.value,
      close: close.value,
      openY: open.y,
      highY: high.y,
      lowY: low.y,
      closeY: close.y,
      status: getStatus(open.value, close.value),
      body: {
        x: openPoint.x - normalizedCandleWidth / 2,
        y: bodyY,
        width: normalizedCandleWidth,
        height: bodyHeight,
      },
      wick: {
        x: openPoint.x,
        y1: wickY1,
        y2: wickY2,
      },
    });
  }

  return geometry;
};
