import { describe, expect, it } from "vitest";
import { valueFromSidedNumber } from "./valueFromSidedNumber";
describe("valueFromSidedNumber", () => {
    it("should return the number if it is a number", () => {
        expect(valueFromSidedNumber(1, "left")).toBe(1);
        expect(valueFromSidedNumber(1, "right")).toBe(1);
        expect(valueFromSidedNumber(1, "top")).toBe(1);
        expect(valueFromSidedNumber(1, "bottom")).toBe(1);
    });
    it("should return value from side if input is an object", () => {
        expect(valueFromSidedNumber({ left: 1 }, "left")).toBe(1);
        expect(valueFromSidedNumber({ right: 1 }, "right")).toBe(1);
        expect(valueFromSidedNumber({ top: 1 }, "top")).toBe(1);
        expect(valueFromSidedNumber({ bottom: 1 }, "bottom")).toBe(1);
    });
    it("should return default value if input is undefined (with a default default of 0)", () => {
        expect(valueFromSidedNumber({}, "left")).toBe(0);
        expect(valueFromSidedNumber({}, "left", 1)).toBe(1);
    });
});
