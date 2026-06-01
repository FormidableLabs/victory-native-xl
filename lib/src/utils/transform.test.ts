import { describe, expect, it } from "vitest";
import {
  getTransformComponents,
  identity4,
  invert4,
  setScale,
  setTranslate,
} from "./transform";

const expectMatrixCloseTo = (
  actual: readonly number[],
  expected: readonly number[],
) => {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index]!);
  });
};

describe("transform helpers", () => {
  it("returns identity transform components when matrix is missing", () => {
    expect(getTransformComponents(undefined)).toEqual({
      scaleX: 1,
      scaleY: 1,
      translateX: 0,
      translateY: 0,
    });
  });

  it("reads scale and translation components from a matrix", () => {
    const scaled = setScale(identity4, 2, 3);
    const translated = setTranslate(scaled, 12, -5);

    expect(getTransformComponents(translated)).toEqual({
      scaleX: 2,
      scaleY: 3,
      translateX: 12,
      translateY: -5,
    });
  });

  it("defaults uniform scale to both axes", () => {
    expect(getTransformComponents(setScale(identity4, 4))).toMatchObject({
      scaleX: 4,
      scaleY: 4,
    });
  });

  it("preserves zero scale values", () => {
    expect(getTransformComponents(setScale(identity4, 0))).toMatchObject({
      scaleX: 0,
      scaleY: 0,
    });
  });

  it("inverts the identity matrix", () => {
    expectMatrixCloseTo(invert4(identity4), identity4);
  });

  it("returns identity for non-invertible matrices", () => {
    const zeroMatrix = Array(16).fill(0) as unknown as typeof identity4;

    expectMatrixCloseTo(invert4(zeroMatrix), identity4);
  });
});
