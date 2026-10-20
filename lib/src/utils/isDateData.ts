/**
 * X values are treated as a time scale when *every* value is a valid Date.
 * A mixed array — or one holding an Invalid Date — falls back to the existing
 * numerical/categorical handling, so charts that don't use dates are unaffected.
 */
export const isDateArray = (values: unknown[]): boolean =>
  values.length > 0 && values.every(isValidDate);

export const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

/**
 * Dates are positioned by their epoch timestamp, which a linear scale handles
 * identically to a d3 time scale. Only tick placement and label formatting need
 * to know they're dates.
 */
export const dateToNumber = (value: unknown): number =>
  isValidDate(value) ? value.getTime() : NaN;
