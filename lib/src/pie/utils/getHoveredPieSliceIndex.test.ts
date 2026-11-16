import { describe, expect, it } from "vitest";
import { getHoveredPieSliceIndex } from "./getHoveredPieSliceIndex";
import type { PieSliceData } from "../PieSlice";

const center = { x: 100, y: 100 };
const radius = 80;

type SliceInput = { sweepAngle: number };

const makeSlices = (
  startAngleIn: number,
  inputs: SliceInput[],
): PieSliceData[] => {
  let startAngle = startAngleIn;
  return inputs.map((input) => {
    const slice: PieSliceData = {
      value: 1,
      label: "slice",
      color: "#000",
      innerRadius: 0,
      startAngle,
      endAngle: startAngle + input.sweepAngle,
      sweepAngle: input.sweepAngle,
      sliceIsEntireCircle: false,
      radius,
      center,
    };
    startAngle += input.sweepAngle;
    return slice;
  });
};

const pointerAt = (angleDeg: number, dist?: number) => {
  const r = dist ?? radius / 2;
  return {
    x: center.x + r * Math.cos((angleDeg * Math.PI) / 180),
    y: center.y + r * Math.sin((angleDeg * Math.PI) / 180),
  };
};

describe("getHoveredPieSliceIndex", () => {
  it("returns -1 without a pointer", () => {
    expect(
      getHoveredPieSliceIndex({
        pointer: null,
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices: makeSlices(0, [{ sweepAngle: 180 }, { sweepAngle: 180 }]),
      }),
    ).toBe(-1);
  });

  it("returns -1 when the pointer is outside the pie radius", () => {
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(90, radius + 20),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices: makeSlices(0, [{ sweepAngle: 360 }]),
      }),
    ).toBe(-1);
  });

  it("matches the slice containing the pointer angle", () => {
    const slices = makeSlices(0, [
      { sweepAngle: 120 },
      { sweepAngle: 120 },
      { sweepAngle: 120 },
    ]);
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(60),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices,
      }),
    ).toBe(0);
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(150),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices,
      }),
    ).toBe(1);
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(300),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices,
      }),
    ).toBe(2);
  });

  it("matches slices after a negative start angle offset", () => {
    const startAngle = -90; // chart starts at 12 o'clock
    const slices = makeSlices(startAngle, [
      { sweepAngle: 180 },
      { sweepAngle: 180 },
    ]);
    // atan2 angle 0° (due right) sits 90° into the -90° chart
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(0),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle,
        slices,
      }),
    ).toBe(0);
    // atan2 angle 135° is 225° past the chart start -> second slice
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(135),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle,
        slices,
      }),
    ).toBe(1);
  });

  it("wraps pointer angles around 360°", () => {
    const slices = makeSlices(0, [{ sweepAngle: 90 }, { sweepAngle: 270 }]);
    // atan2 angle of 350° sits just before the 90°-start chart boundary,
    // rel = (350 - 90) % 360 = 260 -> second slice
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(350),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 90,
        slices,
      }),
    ).toBe(1);
  });

  it("returns -1 when the pointer is outside a partial-pie sweep", () => {
    const slices = makeSlices(0, [{ sweepAngle: 180 }]);
    // full circle sweep is only 180° deep, pointer at rel ~270° is beyond it
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(270),
        center,
        radius,
        circleSweepDegrees: 180,
        startAngle: 0,
        slices,
      }),
    ).toBe(-1);
  });

  it("returns -1 inside the donut hole", () => {
    const slices = makeSlices(0, [{ sweepAngle: 360 }]).map((slice) => ({
      ...slice,
      innerRadius: 40,
    }));
    // dead center of the donut
    expect(
      getHoveredPieSliceIndex({
        pointer: { x: center.x, y: center.y },
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices,
      }),
    ).toBe(-1);
    // within the hole but off-center
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(200, 10),
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle: 0,
        slices,
      }),
    ).toBe(-1);
  });

  it("matches slices whose angles are measured relative to the chart start", () => {
    const startAngle = 200;
    const slices: PieSliceData[] = [
      {
        value: 1,
        label: "slice",
        color: "#000",
        innerRadius: 0,
        // unwrapped domain continues past 360, like the real PieChart build
        startAngle: startAngle,
        endAngle: startAngle + 160,
        sweepAngle: 160,
        sliceIsEntireCircle: false,
        radius,
        center,
      },
      {
        value: 1,
        label: "slice",
        color: "#000",
        innerRadius: 0,
        startAngle: startAngle + 160,
        endAngle: startAngle + 360,
        sweepAngle: 200,
        sliceIsEntireCircle: false,
        radius,
        center,
      },
    ];
    expect(
      getHoveredPieSliceIndex({
        pointer: pointerAt(20), // rel = (20 - 200 + 360) % 360 = 180 -> second
        center,
        radius,
        circleSweepDegrees: 360,
        startAngle,
        slices,
      }),
    ).toBe(1);
  });
});
