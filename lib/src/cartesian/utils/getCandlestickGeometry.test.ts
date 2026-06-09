import { describe, expect, it } from "vitest";
import type { PointsArray } from "../../types";
import { getCandlestickGeometry } from "./getCandlestickGeometry";

const makePoint = (
  x: number,
  xValue: PointsArray[number]["xValue"],
  y: number | null | undefined,
  yValue: number | null | undefined,
) => ({ x, xValue, y, yValue }) satisfies PointsArray[number];

describe("getCandlestickGeometry", () => {
  it("builds positive candle geometry from OHLC points", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [makePoint(50, "A", 80, 10)],
      highPoints: [makePoint(50, "A", 40, 18)],
      lowPoints: [makePoint(50, "A", 95, 5)],
      closePoints: [makePoint(50, "A", 50, 16)],
      candleWidth: 12,
    });

    expect(geometry).toEqual([
      {
        datumIndex: 0,
        x: 50,
        xValue: "A",
        open: 10,
        high: 18,
        low: 5,
        close: 16,
        openY: 80,
        highY: 40,
        lowY: 95,
        closeY: 50,
        status: "positive",
        body: { x: 44, y: 50, width: 12, height: 30 },
        wick: { x: 50, y1: 40, y2: 95 },
      },
    ]);
  });

  it("builds negative candle geometry from OHLC points", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [makePoint(50, 1, 40, 18)],
      highPoints: [makePoint(50, 1, 30, 22)],
      lowPoints: [makePoint(50, 1, 90, 8)],
      closePoints: [makePoint(50, 1, 80, 10)],
      candleWidth: 10,
    });

    expect(geometry[0]).toMatchObject({
      status: "negative",
      body: { x: 45, y: 40, width: 10, height: 40 },
      wick: { x: 50, y1: 30, y2: 90 },
    });
  });

  it("keeps neutral doji candles visible with a minimum body height", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [makePoint(50, "A", 60, 12)],
      highPoints: [makePoint(50, "A", 40, 16)],
      lowPoints: [makePoint(50, "A", 80, 8)],
      closePoints: [makePoint(50, "A", 60, 12)],
      candleWidth: 8,
      minBodyHeight: 2,
    });

    expect(geometry[0]).toMatchObject({
      status: "neutral",
      body: { x: 46, y: 59, width: 8, height: 2 },
    });
  });

  it("applies minimum body height to tiny non-doji bodies", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [makePoint(50, "A", 60, 12)],
      highPoints: [makePoint(50, "A", 40, 16)],
      lowPoints: [makePoint(50, "A", 80, 8)],
      closePoints: [makePoint(50, "A", 60.25, 11.9)],
      candleWidth: 8,
      minBodyHeight: 2,
    });

    expect(geometry[0]).toMatchObject({
      status: "negative",
      body: { x: 46, y: 59.125, width: 8, height: 2 },
    });
  });

  it("skips candles with missing or non-finite OHLC coordinates", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [
        makePoint(50, "A", 60, 12),
        makePoint(60, "B", undefined, undefined),
        makePoint(Number.NaN, "C", 60, 12),
      ],
      highPoints: [
        makePoint(50, "A", 40, 16),
        makePoint(60, "B", 40, 16),
        makePoint(Number.NaN, "C", 40, 16),
      ],
      lowPoints: [
        makePoint(50, "A", 80, 8),
        makePoint(60, "B", 80, 8),
        makePoint(Number.NaN, "C", 80, 8),
      ],
      closePoints: [
        makePoint(50, "A", 55, 14),
        makePoint(60, "B", 55, 14),
        makePoint(Number.NaN, "C", 55, 14),
      ],
      candleWidth: 8,
    });

    expect(geometry).toHaveLength(1);
    expect(geometry[0]?.xValue).toBe("A");
  });

  it("uses the shortest OHLC point array length", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [makePoint(50, "A", 60, 12), makePoint(60, "B", 55, 14)],
      highPoints: [makePoint(50, "A", 40, 16)],
      lowPoints: [makePoint(50, "A", 80, 8), makePoint(60, "B", 80, 8)],
      closePoints: [makePoint(50, "A", 55, 14), makePoint(60, "B", 45, 18)],
      candleWidth: 8,
    });

    expect(geometry).toHaveLength(1);
    expect(geometry[0]?.datumIndex).toBe(0);
  });

  it("normalizes negative candle widths", () => {
    const geometry = getCandlestickGeometry({
      openPoints: [makePoint(50, "A", 60, 12)],
      highPoints: [makePoint(50, "A", 40, 16)],
      lowPoints: [makePoint(50, "A", 80, 8)],
      closePoints: [makePoint(50, "A", 55, 14)],
      candleWidth: -8,
    });

    expect(geometry[0]?.body).toMatchObject({
      x: 50,
      width: 0,
    });
  });
});
