import { describe, expect, it } from "vitest";
import { type ChartLayoutModeProps } from "./ChartLayoutModeProps";

const explicitSize = { width: 100, height: 100 };
const dynamicHeadless: boolean = true;

const validLayoutModeProps: ChartLayoutModeProps[] = [
  {},
  { headless: false },
  { explicitSize },
  { explicitSize, headless: false },
  { explicitSize, headless: true },
  { explicitSize, headless: dynamicHeadless },
];

// @ts-expect-error `headless: true` requires `explicitSize`.
const invalidHeadlessTrueWithoutExplicitSize: ChartLayoutModeProps = {
  headless: true,
};

// @ts-expect-error dynamic `headless` may be true and requires `explicitSize`.
const invalidBooleanHeadlessWithoutExplicitSize: ChartLayoutModeProps = {
  headless: dynamicHeadless,
};

describe("ChartLayoutModeProps", () => {
  it("allows dynamic headless values when explicitSize is set", () => {
    expect(validLayoutModeProps).toHaveLength(6);
    expect(invalidHeadlessTrueWithoutExplicitSize).toEqual({ headless: true });
    expect(invalidBooleanHeadlessWithoutExplicitSize).toEqual({
      headless: dynamicHeadless,
    });
  });
});
