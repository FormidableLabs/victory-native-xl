import { describe, expect, it } from "vitest";
import {
  type ChartPressBootstrapEntry,
  pruneChartPressBootstrap,
} from "./chartPressBootstrap";

type TestState = {
  name: string;
};

type TestTouch = {
  id: number;
};

const bootstrapEntry = (
  name: string,
  touchId: number,
  pressIndex: number,
): ChartPressBootstrapEntry<TestState, TestTouch> => ({
  pressIndex,
  state: { name },
  touch: { id: touchId },
});

describe("chartPressBootstrap", () => {
  it("removes touches released before pan activation", () => {
    const first = bootstrapEntry("first", 10, 0);
    const second = bootstrapEntry("second", 11, 1);

    const next = pruneChartPressBootstrap({
      bootstrap: [first, second],
      changedTouches: [{ id: 10 }],
      numberOfTouches: 1,
    });

    expect(next).toEqual([second]);
    expect(next[0]?.pressIndex).toBe(1);
  });

  it("clears every pending touch when no touches remain", () => {
    const next = pruneChartPressBootstrap({
      bootstrap: [
        bootstrapEntry("first", 10, 0),
        bootstrapEntry("second", 11, 1),
      ],
      changedTouches: [{ id: 10 }],
      numberOfTouches: 0,
    });

    expect(next).toEqual([]);
  });

  it("keeps pending touches when the released touch id is unknown", () => {
    const first = bootstrapEntry("first", 10, 0);

    const next = pruneChartPressBootstrap({
      bootstrap: [first],
      changedTouches: [{}],
      numberOfTouches: 1,
    });

    expect(next).toEqual([first]);
  });
});
