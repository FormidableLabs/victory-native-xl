import { describe, expect, it } from "vitest";
import { stitchDataArray } from "./stitchDataArray";
describe("stitchDataArray", () => {
    it("does basic stitching", () => {
        const DATA = [
            makePoint(1, 1),
            makePoint(2, 5),
            makePoint(3, 2),
        ];
        expect(stitchDataArray(DATA)).toEqual([
            [1, 1],
            [2, 5],
            [3, 2],
        ]);
    });
    it("omits data points with non-numerical y values", () => {
        const DATA = [
            makePoint(1, 1),
            makePoint(2, null),
            makePoint(3, 2),
        ];
        expect(stitchDataArray(DATA)).toEqual([
            [1, 1],
            [3, 2],
        ]);
    });
});
const makePoint = (x, y) => ({
    x,
    y,
    xValue: x,
    yValue: y,
});
