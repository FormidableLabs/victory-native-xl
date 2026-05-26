import { describe, expect, it } from "vitest";
import { makeScale } from "./makeScale";
import { getCartesianChartBounds } from "./getCartesianChartBounds";

describe("getCartesianChartBounds", () => {
  it("uses the scale domain bounds when there is no viewport", () => {
    const xScale = makeScale({
      inputBounds: [0, 10],
      outputBounds: [20, 220],
      padStart: 10,
      padEnd: 15,
    });
    const yScale = makeScale({
      inputBounds: [0, 100],
      outputBounds: [10, 210],
      padStart: 8,
      padEnd: 12,
    });

    expect(
      getCartesianChartBounds({
        xScale,
        yScale,
        domainPadding: { left: 10, right: 15, top: 8, bottom: 12 },
      }),
    ).toEqual({ left: 20, right: 220, top: 10, bottom: 210 });
  });

  it("keeps viewport bounds at the visible plot edges when domainPadding is set", () => {
    const xScale = makeScale({
      inputBounds: [0, 10],
      outputBounds: [20, 220],
      viewport: [2, 6],
      padStart: 10,
      padEnd: 15,
    });
    const yScale = makeScale({
      inputBounds: [0, 100],
      outputBounds: [10, 210],
      viewport: [80, 20],
      padStart: 8,
      padEnd: 12,
    });

    expect(xScale(2)).toBe(30);
    expect(xScale(6)).toBe(205);
    expect(yScale(80)).toBe(18);
    expect(yScale(20)).toBe(198);

    expect(
      getCartesianChartBounds({
        xScale,
        yScale,
        viewport: { x: [2, 6], y: [20, 80] },
        domainPadding: { left: 10, right: 15, top: 8, bottom: 12 },
      }),
    ).toEqual({ left: 20, right: 220, top: 10, bottom: 210 });
  });

  it("uses horizontal category viewport bounds in top-to-bottom order", () => {
    const xScale = makeScale({
      inputBounds: [0, 100],
      outputBounds: [20, 220],
      viewport: [25, 75],
      padStart: 10,
      padEnd: 15,
    });
    const yScale = makeScale({
      inputBounds: [0, 4],
      outputBounds: [10, 210],
      viewport: [1, 3],
      padStart: 8,
      padEnd: 12,
    });

    expect(yScale(1)).toBe(18);
    expect(yScale(3)).toBe(198);

    expect(
      getCartesianChartBounds({
        xScale,
        yScale,
        viewport: { x: [25, 75], y: [1, 3] },
        domainPadding: { left: 10, right: 15, top: 8, bottom: 12 },
        orientation: "horizontal",
      }),
    ).toEqual({ left: 20, right: 220, top: 10, bottom: 210 });
  });
});
