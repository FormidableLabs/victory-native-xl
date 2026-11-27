import { area, line } from "d3-shape";
import { Skia } from "react-native-skia";
import { describe, expect, it } from "vitest";
import {
  addAreaToPathBuilder,
  addLineToPathBuilder,
  type DefinedPoint,
} from "../../src/cartesian/utils/chartPaths";
import { CURVES, type CurveType } from "../../src/cartesian/utils/curves";

const CURVE_TYPES = Object.keys(CURVES) as CurveType[];

// Deterministic pseudo random numbers, so failures are reproducible.
const makeRandom = (seed: number) => () =>
  (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;

const makePoints = (count: number, seed = 42): DefinedPoint[] => {
  const random = makeRandom(seed);
  return Array.from({ length: count }, (_, i) => ({
    x: 16 + (i * 360) / Math.max(1, count - 1),
    y: 20 + random() * 180,
  }));
};

const DATASETS: Record<string, DefinedPoint[]> = {
  "no points": [],
  "1 point": makePoints(1),
  "2 points": makePoints(2),
  "3 points": makePoints(3),
  "4 points": makePoints(4),
  "12 points": makePoints(12),
  "100 points": makePoints(100, 7),
  "flat line": makePoints(6).map(({ x }) => ({ x, y: 80 })),
  "repeated points": [
    { x: 10, y: 30 },
    { x: 10, y: 30 },
    { x: 40, y: 90 },
    { x: 40, y: 90 },
    { x: 90, y: 10 },
  ],
  "vertical segment": [
    { x: 10, y: 30 },
    { x: 50, y: 60 },
    { x: 50, y: 120 },
    { x: 90, y: 10 },
  ],
  "decreasing x": makePoints(8, 3).reverse(),
  // Coordinates that round to -0, that sit halfway between two thousandths,
  // and that are too large or too small for 3 decimals to matter.
  "coordinates at the limits of rounding": [
    { x: -0.0001, y: -0.0004 },
    { x: 10.0005, y: 20.00049 },
    { x: 30.0015, y: 1e-7 },
    { x: 123456.7891, y: -98765.4321 },
    { x: 1e9, y: 0.0005 },
  ],
};

const BASELINE = 220;
// Stands in for the per point baseline of a stacked area.
const slantedBaseline = (index: number) => BASELINE - index * 1.5;

/**
 * What the paths used to be made from: d3-shape prints an SVG string, with
 * coordinates rounded to 3 decimals, that Skia parses back.
 */
const fromSvg = (svg: string | null) =>
  svg ? Skia.Path.MakeFromSVGString(svg)?.toCmds() ?? [] : [];

const toTuples = (points: DefinedPoint[]) =>
  points.map(({ x, y }): [number, number] => [x, y]);

// `toEqual` compares numbers with `Object.is`: the builders have to give Skia
// exactly the coordinates it used to parse from the SVG string.
const expectSameCommands = (actual: number[][], expected: number[][]) => {
  expect(actual).toEqual(expected);
};

// Linear paths are built with `addPoly` on native and command by command on
// web: both have to produce the same path.
const STRATEGIES = [
  { name: "with addPoly", useAddPoly: true },
  { name: "without addPoly", useAddPoly: false },
];

describe("addLineToPathBuilder", () => {
  describe.each(STRATEGIES)("linear $name", ({ useAddPoly }) => {
    it.each(Object.keys(DATASETS))(
      "draws what d3-shape prints for %s",
      (name) => {
        const points = DATASETS[name]!;
        const builder = Skia.PathBuilder.Make();
        addLineToPathBuilder(builder, points, "linear", useAddPoly);

        expectSameCommands(
          builder.detach().toCmds(),
          fromSvg(line()(toTuples(points))),
        );
      },
    );
  });

  describe.each(CURVE_TYPES)("%s", (curveType) => {
    it.each(Object.keys(DATASETS))(
      "draws what d3-shape prints for %s",
      (name) => {
        const points = DATASETS[name]!;
        const builder = Skia.PathBuilder.Make();
        addLineToPathBuilder(builder, points, curveType);

        expectSameCommands(
          builder.detach().toCmds(),
          fromSvg(line().curve(CURVES[curveType])(toTuples(points))),
        );
      },
    );
  });

  it("appends each run as its own contour", () => {
    const builder = Skia.PathBuilder.Make();
    addLineToPathBuilder(builder, makePoints(3), "linear");
    addLineToPathBuilder(builder, makePoints(1, 5), "linear");
    addLineToPathBuilder(builder, makePoints(4, 9), "monotoneX");

    const svg = [
      line()(toTuples(makePoints(3))),
      line()(toTuples(makePoints(1, 5))),
      line().curve(CURVES.monotoneX)(toTuples(makePoints(4, 9))),
    ].join("");

    expectSameCommands(builder.detach().toCmds(), fromSvg(svg));
  });

  it.each(CURVE_TYPES)(
    "skips a %s run with a non-finite point",
    (curveType) => {
      const points = makePoints(5);
      points[2] = { x: points[2]!.x, y: NaN };
      const builder = Skia.PathBuilder.Make();
      addLineToPathBuilder(builder, points, curveType);

      expect(builder.isEmpty()).toBe(true);
    },
  );
});

describe("addAreaToPathBuilder", () => {
  describe.each(STRATEGIES)("linear $name", ({ useAddPoly }) => {
    it.each(Object.keys(DATASETS))(
      "draws what d3-shape prints for %s over a per point baseline",
      (name) => {
        const points = DATASETS[name]!;
        const builder = Skia.PathBuilder.Make();
        addAreaToPathBuilder(
          builder,
          points,
          slantedBaseline,
          "linear",
          useAddPoly,
        );

        expectSameCommands(
          builder.detach().toCmds(),
          fromSvg(area().y0((_, i) => slantedBaseline(i))(toTuples(points))),
        );
      },
    );
  });

  describe.each(CURVE_TYPES)("%s", (curveType) => {
    it.each(Object.keys(DATASETS))(
      "draws what d3-shape prints for %s over a flat baseline",
      (name) => {
        const points = DATASETS[name]!;
        const builder = Skia.PathBuilder.Make();
        addAreaToPathBuilder(builder, points, () => BASELINE, curveType);

        expectSameCommands(
          builder.detach().toCmds(),
          fromSvg(
            area().y0(BASELINE).curve(CURVES[curveType])(toTuples(points)),
          ),
        );
      },
    );

    it.each(Object.keys(DATASETS))(
      "draws what d3-shape prints for %s over a per point baseline",
      (name) => {
        const points = DATASETS[name]!;
        const builder = Skia.PathBuilder.Make();
        addAreaToPathBuilder(builder, points, slantedBaseline, curveType);

        expectSameCommands(
          builder.detach().toCmds(),
          fromSvg(
            area()
              .y0((_, i) => slantedBaseline(i))
              .curve(CURVES[curveType])(toTuples(points)),
          ),
        );
      },
    );
  });

  it.each(CURVE_TYPES)(
    "skips a %s run with a non-finite baseline",
    (curveType) => {
      const builder = Skia.PathBuilder.Make();
      addAreaToPathBuilder(builder, makePoints(5), () => NaN, curveType);

      expect(builder.isEmpty()).toBe(true);
    },
  );
});
