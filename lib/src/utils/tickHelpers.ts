export const DEFAULT_TICK_COUNT = 5;

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

  if (tickCount <= 0) {
    return [];
  }

  if (!Array.isArray(tickValues) || tickValues.length <= tickCount) {
    return tickValues;
  }

  if (tickCount === 1) {
    return [tickValues[0]!];
  }

  const lastIndex = tickValues.length - 1;
  return Array.from({ length: tickCount }, (_, i) => {
    const tickIndex = Math.round((i * lastIndex) / (tickCount - 1));
    return tickValues[tickIndex]!;
  });
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
  if (!tickValues || tickValues.length === 0) return;

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
