import { describe, expect, it, vi } from "vitest";
import type { Matrix4 } from "@shopify/react-native-skia";
import {
  identity4,
  getTransformComponents,
  setScale,
  setTranslate,
  invert4,
} from "./transform";

// Mock the Matrix4 constructor from react-native-skia
vi.mock("@shopify/react-native-skia", () => ({
  Matrix4: vi.fn(
    () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] as Matrix4,
  ),
}));

// Helper function for matrix multiplication test - using Strategy pattern for matrix operations
function multiplyMatrices(a: Matrix4, b: Matrix4): Matrix4 {
  const result = new Array(16).fill(0) as number[];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i * 4 + j]! += a[i * 4 + k]! * b[k * 4 + j]!;
      }
    }
  }

  return result as unknown as Matrix4;
}

describe("transform utilities", () => {
  describe("identity4", () => {
    it("returns a 4x4 identity matrix", () => {
      expect(identity4).toEqual([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
    });
  });

  describe("getTransformComponents", () => {
    it("extracts transform components from a matrix", () => {
      const matrix: Matrix4 = [
        2,
        0,
        0,
        5, // scaleX=2, translateX=5
        0,
        3,
        0,
        10, // scaleY=3, translateY=10
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const components = getTransformComponents(matrix);

      expect(components).toEqual({
        scaleX: 2,
        scaleY: 3,
        translateX: 5,
        translateY: 10,
      });
    });

    it("returns default values for undefined matrix", () => {
      const components = getTransformComponents(undefined);

      expect(components).toEqual({
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
      });
    });

    it("uses default values for falsy matrix values", () => {
      const matrix: Matrix4 = [
        0,
        0,
        0,
        0, // scaleX=0 (falsy), translateX=0 (falsy)
        0,
        0,
        0,
        0, // scaleY=0 (falsy), translateY=0 (falsy)
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const components = getTransformComponents(matrix);

      expect(components).toEqual({
        scaleX: 1, // defaults to 1 when falsy
        scaleY: 1, // defaults to 1 when falsy
        translateX: 0, // 0 is falsy, so uses default 0
        translateY: 0, // 0 is falsy, so uses default 0
      });
    });
  });

  describe("setScale", () => {
    it("sets uniform scale when only kx is provided", () => {
      const result = setScale(identity4, 2);

      expect(result[0]).toBe(2); // scaleX
      expect(result[5]).toBe(2); // scaleY
      // Other values should remain unchanged
      expect(result[10]).toBe(1); // scaleZ
      expect(result[15]).toBe(1); // w
    });

    it("sets different scale values when both kx and ky are provided", () => {
      const result = setScale(identity4, 2, 3);

      expect(result[0]).toBe(2); // scaleX
      expect(result[5]).toBe(3); // scaleY
    });

    it("preserves other matrix values", () => {
      const matrix: Matrix4 = [
        1,
        0,
        0,
        5, // translateX=5
        0,
        1,
        0,
        10, // translateY=10
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const result = setScale(matrix, 2, 3);

      expect(result[0]).toBe(2); // scaleX
      expect(result[5]).toBe(3); // scaleY
      expect(result[3]).toBe(5); // translateX preserved
      expect(result[7]).toBe(10); // translateY preserved
    });
  });

  describe("setTranslate", () => {
    it("sets translation values", () => {
      const result = setTranslate(identity4, 10, 20);

      expect(result[3]).toBe(10); // translateX
      expect(result[7]).toBe(20); // translateY
    });

    it("preserves other matrix values", () => {
      const matrix: Matrix4 = [
        2,
        0,
        0,
        0, // scaleX=2
        0,
        3,
        0,
        0, // scaleY=3
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const result = setTranslate(matrix, 10, 20);

      expect(result[0]).toBe(2); // scaleX preserved
      expect(result[5]).toBe(3); // scaleY preserved
      expect(result[3]).toBe(10); // translateX
      expect(result[7]).toBe(20); // translateY
    });

    it("handles negative translation values", () => {
      const result = setTranslate(identity4, -5, -10);

      expect(result[3]).toBe(-5); // translateX
      expect(result[7]).toBe(-10); // translateY
    });
  });

  describe("invert4", () => {
    it("inverts the identity matrix to itself", () => {
      const result = invert4(identity4);

      // Use toBeCloseTo for floating-point comparisons
      result.forEach((value, index) => {
        expect(value).toBeCloseTo(identity4[index]!);
      });
    });

    it("inverts a translation matrix", () => {
      const translateMatrix: Matrix4 = [
        1,
        0,
        0,
        5, // translateX=5
        0,
        1,
        0,
        10, // translateY=10
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const result = invert4(translateMatrix);

      // Inverse of translation should have negative translation values
      expect(result[3]).toBeCloseTo(-5); // translateX
      expect(result[7]).toBeCloseTo(-10); // translateY
      expect(result[0]).toBeCloseTo(1); // scaleX
      expect(result[5]).toBeCloseTo(1); // scaleY
    });

    it("inverts a scale matrix", () => {
      const scaleMatrix: Matrix4 = [
        2,
        0,
        0,
        0, // scaleX=2
        0,
        4,
        0,
        0, // scaleY=4
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const result = invert4(scaleMatrix);

      // Inverse of scale should have reciprocal scale values
      expect(result[0]).toBeCloseTo(0.5); // 1/2
      expect(result[5]).toBeCloseTo(0.25); // 1/4
    });

    it("returns identity matrix for non-invertible matrix", () => {
      const nonInvertibleMatrix: Matrix4 = [
        0,
        0,
        0,
        0, // determinant will be 0
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ];

      const result = invert4(nonInvertibleMatrix);

      expect(result).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    });

    it("correctly inverts a complex transformation matrix", () => {
      const complexMatrix: Matrix4 = [
        2,
        0,
        0,
        10, // scale and translate
        0,
        3,
        0,
        20,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const result = invert4(complexMatrix);

      // Verify by multiplying original with inverse should give identity
      const shouldBeIdentity = multiplyMatrices(complexMatrix, result);

      expect(shouldBeIdentity[0]).toBeCloseTo(1, 5);
      expect(shouldBeIdentity[5]).toBeCloseTo(1, 5);
      expect(shouldBeIdentity[10]).toBeCloseTo(1, 5);
      expect(shouldBeIdentity[15]).toBeCloseTo(1, 5);
      expect(shouldBeIdentity[3]).toBeCloseTo(0, 5);
      expect(shouldBeIdentity[7]).toBeCloseTo(0, 5);
    });

    it("handles matrices with small determinants correctly", () => {
      const nearSingularMatrix: Matrix4 = [
        1e-9,
        0,
        0,
        0, // very small but non-zero scale
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];

      const result = invert4(nearSingularMatrix);

      // Should return identity matrix due to small determinant threshold
      expect(result).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    });
  });
});
