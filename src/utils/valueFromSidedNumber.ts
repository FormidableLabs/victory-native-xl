import type { SidedNumber } from "../types";

export const valueFromSidedNumber = (
  sidedNumber: SidedNumber | undefined,
  side: keyof Exclude<SidedNumber, number>,
  defaultValue = 0,
) => {
  "worklet";

  return typeof sidedNumber === "number"
    ? sidedNumber
    : sidedNumber?.[side] || defaultValue;
};
