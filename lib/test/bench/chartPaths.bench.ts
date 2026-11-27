/**
 * Microbenchmark for line and area path construction.
 *
 * Compares the current path builders with the SVG string round trip they
 * replaced (d3-shape prints an SVG path, Skia parses it back), which is kept
 * here as the baseline.
 *
 * Run with `yarn workspace victory-native bench`. This runs CanvasKit (Wasm)
 * in Node, not native Skia over JSI on Hermes, so read the ratios rather than
 * the absolute numbers.
 */
import { area, line } from "d3-shape";
import { Skia } from "react-native-skia";
import { bench, describe } from "vitest";
import {
  addAreaToPathBuilder,
  addLineToPathBuilder,
  type DefinedPoint,
} from "../../src/cartesian/utils/chartPaths";
import { CURVES, type CurveType } from "../../src/cartesian/utils/curves";

const SIZES = [12, 100, 1000, 5000];
const BENCHED_CURVES: CurveType[] = ["linear", "monotoneX"];
const BASELINE = 220;

const makePoints = (count: number): DefinedPoint[] => {
  let seed = 42;
  const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  return Array.from({ length: count }, (_, i) => ({
    x: 16 + (i * 360) / Math.max(1, count - 1),
    y: 20 + random() * 180,
  }));
};

const baseline = () => BASELINE;

describe.each(SIZES)("%i points", (count) => {
  const points = makePoints(count);
  const tuples = points.map(({ x, y }): [number, number] => [x, y]);

  describe.each(BENCHED_CURVES)("%s line", (curveType) => {
    bench("SVG string round trip (baseline)", () => {
      const svg = line().curve(CURVES[curveType])(tuples)!;
      const parsed = Skia.Path.MakeFromSVGString(svg)!;
      const builder = Skia.PathBuilder.Make();
      builder.addPath(parsed);
      builder.build().dispose();
      builder.dispose();
      parsed.dispose();
    });

    bench("PathBuilder", () => {
      const builder = Skia.PathBuilder.Make();
      addLineToPathBuilder(builder, points, curveType);
      builder.detach().dispose();
      builder.dispose();
    });

    if (curveType === "linear") {
      // What native uses. Slower than issuing the commands one by one here,
      // because of how react-native-skia implements `addPoly` on web.
      bench("PathBuilder with addPoly", () => {
        const builder = Skia.PathBuilder.Make();
        addLineToPathBuilder(builder, points, curveType, true);
        builder.detach().dispose();
        builder.dispose();
      });
    }
  });

  describe.each(BENCHED_CURVES)("%s area", (curveType) => {
    bench("SVG string round trip (baseline)", () => {
      const svg = area().y0(BASELINE).curve(CURVES[curveType])(tuples)!;
      const parsed = Skia.Path.MakeFromSVGString(svg)!;
      const builder = Skia.PathBuilder.Make();
      builder.addPath(parsed);
      builder.build().dispose();
      builder.dispose();
      parsed.dispose();
    });

    bench("PathBuilder", () => {
      const builder = Skia.PathBuilder.Make();
      addAreaToPathBuilder(builder, points, baseline, curveType);
      builder.detach().dispose();
      builder.dispose();
    });
  });
});
