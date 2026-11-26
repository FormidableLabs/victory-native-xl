import type { line } from "d3-shape";
import type { SkPathBuilder } from "react-native-skia";

/**
 * The drawing context d3-shape generators accept through `.context()`.
 */
type D3PathContext = NonNullable<
  Parameters<ReturnType<typeof line>["context"]>[0]
>;

const PRECISION = 1000;

/**
 * Rounds a coordinate to 3 decimals.
 *
 * Paths used to be parsed from the SVG string d3-shape prints, in which every
 * coordinate is rounded this way. Rounding the same way here keeps the paths,
 * and so the pixels, exactly as they were. A thousandth of a pixel is far
 * below anything visible.
 */
export const roundCoordinate = (value: number) =>
  // Adding 0 turns -0 into 0, as printing it did.
  Math.round(value * PRECISION) / PRECISION + 0;

/**
 * The subset of the Canvas path API that d3-shape's line and area generators
 * draw into.
 */
export type PathBuilderContext = {
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  quadraticCurveTo: (x1: number, y1: number, x: number, y: number) => void;
  bezierCurveTo: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number,
  ) => void;
  closePath: () => void;
};

/**
 * Adapts a Skia `PathBuilder` to the Canvas path API, rounding coordinates as
 * d3-shape does when it prints them.
 *
 * With a context, d3-shape calls these methods directly instead of printing an
 * SVG path string, so the path never has to be serialized and parsed back.
 */
export const createPathBuilderContext = (
  builder: SkPathBuilder,
): PathBuilderContext => {
  const round = roundCoordinate;

  return {
    moveTo: (x, y) => {
      builder.moveTo(round(x), round(y));
    },
    lineTo: (x, y) => {
      builder.lineTo(round(x), round(y));
    },
    quadraticCurveTo: (x1, y1, x, y) => {
      builder.quadTo(round(x1), round(y1), round(x), round(y));
    },
    bezierCurveTo: (x1, y1, x2, y2, x, y) => {
      builder.cubicTo(
        round(x1),
        round(y1),
        round(x2),
        round(y2),
        round(x),
        round(y),
      );
    },
    closePath: () => {
      builder.close();
    },
  };
};

/**
 * d3-shape only calls the methods above, but its types ask for a whole
 * `CanvasRenderingContext2D`.
 */
export const asD3Context = (context: PathBuilderContext) =>
  context as unknown as D3PathContext;
