import { describe, it, expect } from "vitest";
import { transformInputData } from "./transformInputData";

const DATA = [
  { x: 0, y: 3, z: 0 },
  { x: 1, y: 7, z: 4 },
  { x: 2, y: 5, z: 10 },
];
const OUTPUT_WINDOW = {
  yMin: 0,
  yMax: 300,
  xMin: 0,
  xMax: 500,
};

describe("transformInputData", () => {
  it("transforms data into internal data structure based on x/y keys", () => {
    const { ix, ox, y } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
    });

    expect(ix).toEqual([0, 1, 2]);
    expect(ox).toEqual([0, 250, 500]);
    expect(y.y).toEqual({
      i: [3, 7, 5],
      o: [210, 90.00000000000001, 150],
    });
    expect(y.z).toEqual({
      i: [0, 4, 10],
      o: [300, 180, 0],
    });
  });

  it("should generate scales based on output window", () => {
    const { xScale, yScale } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
    });

    expect(xScale(0)).toEqual(0);
    expect(xScale(2)).toEqual(500);
    expect(yScale(0)).toEqual(300);
    expect(yScale(10)).toEqual(0);
  });

  it("sorts data by xKey", () => {
    const { ix, y } = transformInputData({
      data: [
        { x: 2, y: 3 },
        { x: 0, y: 7 },
        { x: 1, y: 5 },
      ],
      xKey: "x",
      yKeys: ["y"],
      outputWindow: OUTPUT_WINDOW,
    });

    expect(ix).toEqual([0, 1, 2]);
    expect(y.y.i).toEqual([7, 5, 3]);
  });

  it("should use domain if provided", () => {
    const { xScale, yScale } = transformInputData({
      data: DATA,
      xKey: "x",
      yKeys: ["y", "z"],
      outputWindow: OUTPUT_WINDOW,
      domain: { x: [0, 2.5], y: [0, 1.5] },
    });

    expect(xScale(0)).toEqual(0);
    expect(xScale(2.5)).toEqual(500);
    expect(yScale(0)).toEqual(300);
    expect(yScale(1.5)).toEqual(0);
  });

  // TODO: Some day, test the gridOptions code.
});
