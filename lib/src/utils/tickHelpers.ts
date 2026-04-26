import type { ScaleLinear, ScaleLogarithmic } from "d3-scale";

export const DEFAULT_TICK_COUNT = 5;

/**
 * Exactly `count` evenly-spaced numeric ticks between the extents of `domain`
 * (order-independent: uses min/max of the two endpoints).
 * Unlike d3's `linear.ticks(n)`, this always returns length `count` when count ≥ 1
 * and the domain span is positive.
 */
export const exactLinearTicksFromDomain = (
  domain: [number, number],
  count: number,
): number[] => {
  const n = Math.floor(count);
  if (
    !Number.isFinite(domain[0]) ||
    !Number.isFinite(domain[1]) ||
    !Number.isFinite(n) ||
    n < 1
  ) {
    return [];
  }
  const lo = Math.min(domain[0], domain[1]);
  const hi = Math.max(domain[0], domain[1]);
  if (n === 1) {
    return [(lo + hi) / 2];
  }
  if (lo === hi) {
    return [lo];
  }
  return Array.from(
    { length: n },
    (_, i) => lo + ((hi - lo) * i) / (n - 1),
  );
};

/**
 * Exact tick count on linear scales; defers to d3's `.ticks()` on logarithmic scales.
 */
export const exactTicksFromScale = (
  scale: ScaleLinear<number, number> | ScaleLogarithmic<number, number>,
  count: number,
): number[] => {
  const floored = Math.floor(count);
  const n =
    Number.isFinite(floored) && floored >= 1 ? floored : DEFAULT_TICK_COUNT;
  const domain = scale.domain();
  const d0 = domain[0];
  const d1 = domain[1];
  if (
    d0 === undefined ||
    d1 === undefined ||
    !Number.isFinite(d0) ||
    !Number.isFinite(d1)
  ) {
    return [];
  }

  if (
    "base" in scale &&
    typeof (scale as ScaleLogarithmic<number, number>).base === "function"
  ) {
    return scale.ticks(n);
  }

  return exactLinearTicksFromDomain([d0, d1], n);
};

function coerceNumArray<T>(collection: Array<T>) {
  return collection.map((item, idx) =>
    Number.isNaN(Number(item)) ? idx : (item as number),
  );
}

const containsNonNumbers = (arr: unknown[] | undefined): boolean => {
  return Array.isArray(arr) && arr.some((t) => Number.isNaN(Number(t)));
};

export const downsampleTicks = (tickValues: number[], tickCount: number) => {
  if (containsNonNumbers(tickValues)) {
    // Throw Error here until we expand tickValues to accept string and date types, like Victory web
    throw new Error("TickValues array must only contain numbers.");
  }

  if (
    !tickCount ||
    !Array.isArray(tickValues) ||
    tickValues.length <= tickCount
  ) {
    return tickValues;
  }
  const k = Math.floor(tickValues.length / tickCount);

  return tickValues.filter((_, i) => i % k === 0);
};

const getMinValue = (arr: Array<number>): number => {
  return Math.min(...arr);
};

const getMaxValue = (arr: Array<number>): number => {
  return Math.max(...arr);
};

export const getDomainFromTicks = (
  tickValues: number[] | undefined,
): [number, number] | undefined => {
  // Check if undefined OR if its not an array of numbers
  if (!tickValues) return;

  let numTicksArr;
  if (containsNonNumbers(tickValues)) {
    // Currently, we should ONLY accept numbers in the tickValues array (accepting strings and dates TBD); however, we want to catch any non-numbers and coerce them to numbers for domain purposes.
    numTicksArr = coerceNumArray(tickValues);
  } else {
    numTicksArr = tickValues;
  }

  const min = getMinValue(numTicksArr);
  const max = getMaxValue(numTicksArr);

  return [min, max];
};
