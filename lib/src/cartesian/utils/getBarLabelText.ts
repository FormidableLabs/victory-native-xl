import type { MaybeNumber } from "../../types";

export const getBarLabelText = (
  value: MaybeNumber,
  formatLabel?: (value: MaybeNumber) => string,
) => {
  if (formatLabel) return formatLabel(value);
  return value == null ? "" : String(value);
};
