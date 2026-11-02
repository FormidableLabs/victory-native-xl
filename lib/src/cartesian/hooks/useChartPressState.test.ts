import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SharedValue } from "react-native-reanimated";
import { makeChartPressState } from "./useChartPressState";
import { resetChartPressState } from "../utils/resetChartPressState";

const mutableStores: { value: unknown }[] = [];

vi.mock("react-native-reanimated", () => ({
  makeMutable: (init: unknown) => {
    const sv = { value: init } as SharedValue<never>;
    mutableStores.push(sv);
    return sv;
  },
}));

beforeEach(() => {
  mutableStores.length = 0;
});

describe("makeChartPressState", () => {
  it("builds a fully initialized ChartPressState from the initial values", () => {
    const state = makeChartPressState({
      x: 3,
      y: { high: 40, low: 10 },
    });

    expect(state.isActive.value).toBe(false);
    expect(state.matchedIndex.value).toBe(-1);
    expect(state.yIndex.value).toBe(-1);
    expect(state.x.value.value).toBe(3);
    expect(state.x.position.value).toBe(0);
    expect(state.y.high.value.value).toBe(40);
    expect(state.y.high.position.value).toBe(0);
    expect(state.y.low.value.value).toBe(10);
    expect(state.y.low.position.value).toBe(0);
  });

  it("creates independent shared values per call", () => {
    const a = makeChartPressState({ x: 1, y: { v: 0 } });
    const b = makeChartPressState({ x: 2, y: { v: 0 } });

    a.x.value.value = 99;
    expect(b.x.value.value).toBe(2);

    a.isActive.value = true;
    expect(b.isActive.value).toBe(false);
  });

  it("produces a state that resetChartPressState clears", () => {
    const state = makeChartPressState({ x: 5, y: { high: 1 } });

    state.isActive.value = true;
    state.matchedIndex.value = 7;
    state.yIndex.value = 3;
    state.x.position.value = 120;
    state.y.high.position.value = 80;

    resetChartPressState(state);

    expect(state.isActive.value).toBe(false);
    expect(state.matchedIndex.value).toBe(-1);
    expect(state.yIndex.value).toBe(-1);
    expect(state.x.position.value).toBe(0);
    expect(state.x.value.value).toBe(5);
    expect(state.y.high.position.value).toBe(0);
    expect(state.y.high.value.value).toBe(1);
  });
});
