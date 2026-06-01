import type { SharedValue } from "react-native-reanimated";
import { describe, expect, it } from "vitest";
import type { ChartPressState } from "../hooks/useChartPressState";
import { resetChartPressState } from "./resetChartPressState";

const shared = <T>(value: T): SharedValue<T> => ({ value }) as SharedValue<T>;

describe("resetChartPressState", () => {
  it("clears active press bookkeeping and measured positions", () => {
    const state = {
      isActive: shared(true),
      matchedIndex: shared(3),
      x: {
        value: shared(42),
        position: shared(120),
      },
      y: {
        high: {
          value: shared(12),
          position: shared(80),
        },
        low: {
          value: shared(6),
          position: shared(140),
        },
      },
      yIndex: shared(1),
    } satisfies ChartPressState<{
      x: number;
      y: { high: number; low: number };
    }>;

    resetChartPressState<{
      x: number;
      y: { high: number; low: number };
    }>(state);

    expect(state.isActive.value).toBe(false);
    expect(state.matchedIndex.value).toBe(-1);
    expect(state.yIndex.value).toBe(-1);
    expect(state.x.value.value).toBe(42);
    expect(state.x.position.value).toBe(0);
    expect(state.y.high.value.value).toBe(12);
    expect(state.y.high.position.value).toBe(0);
    expect(state.y.low.value.value).toBe(6);
    expect(state.y.low.position.value).toBe(0);
  });
});
