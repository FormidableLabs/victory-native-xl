import { describe, expect, it } from "vitest";
import type { MaybeNumber } from "../../types";
import { getBarLabelText } from "./getBarLabelText";

describe("getBarLabelText", () => {
  it("keeps zero values visible by default", () => {
    expect(getBarLabelText(0)).toBe("0");
  });

  it("hides nullish values by default", () => {
    expect(getBarLabelText(null)).toBe("");
    expect(getBarLabelText(undefined)).toBe("");
  });

  it("passes MaybeNumber values to the formatter", () => {
    const values: MaybeNumber[] = [];
    const formatLabel = (value: MaybeNumber) => {
      values.push(value);
      return value == null ? "missing" : `${value}%`;
    };

    expect(getBarLabelText(0, formatLabel)).toBe("0%");
    expect(getBarLabelText(null, formatLabel)).toBe("missing");
    expect(getBarLabelText(undefined, formatLabel)).toBe("missing");
    expect(values).toEqual([0, null, undefined]);
  });
});
