import { describe, expect, it } from "vitest";
import { dateToNumber, isDateArray, isValidDate } from "./isDateData";

describe("isDateArray", () => {
  it("returns true when every value is a Date", () => {
    expect(isDateArray([new Date("2024-01-01"), new Date("2024-01-02")])).toBe(
      true,
    );
  });

  it("returns false for an empty array", () => {
    // An empty chart has no time scale to infer.
    expect(isDateArray([])).toBe(false);
  });

  it("returns false when the values are mixed", () => {
    expect(isDateArray([new Date("2024-01-01"), 5])).toBe(false);
    expect(isDateArray([new Date("2024-01-01"), "2024-01-02"])).toBe(false);
  });

  it("returns false for date-like strings and timestamps", () => {
    expect(isDateArray(["2024-01-01", "2024-01-02"])).toBe(false);
    expect(isDateArray([1704067200000, 1704153600000])).toBe(false);
  });

  it("returns false when any Date is invalid", () => {
    expect(isDateArray([new Date("2024-01-01"), new Date("nonsense")])).toBe(
      false,
    );
  });
});

describe("isValidDate", () => {
  it("rejects Invalid Date", () => {
    expect(isValidDate(new Date("nonsense"))).toBe(false);
    expect(isValidDate(new Date(0))).toBe(true);
  });

  it("rejects non-Dates", () => {
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate(1704067200000)).toBe(false);
  });
});

describe("dateToNumber", () => {
  it("returns the epoch timestamp", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    expect(dateToNumber(date)).toBe(date.getTime());
  });

  it("returns NaN for anything else", () => {
    expect(dateToNumber("2024-01-01")).toBeNaN();
    expect(dateToNumber(new Date("nonsense"))).toBeNaN();
  });
});
