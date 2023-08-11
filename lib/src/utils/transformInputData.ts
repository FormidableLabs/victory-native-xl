import type { InputDatum, MassagedData } from "../types";

/**
 * TODO: Do we discard entries that don't contain all the required data, or what?
 */
export const transformInputData = (
  data: InputDatum[],
  xKey: string,
  yKeys: string[],
): MassagedData => {
  const x: number[] = [];
  const y: Record<string, number[]> = {};
  const _x: (number | string)[] = [];

  if (!data.length) return { x, y, _x };

  const firstX = data[0]?.[xKey];

  // TODO: Going to need more sophisticated sorting logic for e.g. dates.
  const sortedData = Array.from(data);
  if (typeof firstX === "number") {
    sortedData.sort((a, b) => (a[xKey] as number) - (b[xKey] as number));
  }

  // Input data is numbers
  if (typeof firstX === "number") {
    sortedData.forEach((datum) => {
      const xVal = Number(datum[xKey]);
      x.push(xVal);
      yKeys.forEach((key) => {
        y[key] ||= [];
        y[key]!.push(datum[key] as number);
      });
    });
  }

  // Input data is string
  if (typeof firstX === "string") {
    sortedData.forEach((datum, i) => {
      x.push(i);
      _x.push(datum[xKey] as string);
      yKeys.forEach((key) => {
        y[key]! ||= [];
        y[key]!.push(datum[key] as number);
      });
    });
  }

  // TODO: Drop _x if it's not used?
  return { x, y, _x };
};

export const getMinYFromMassagedData = (data: MassagedData): number => {
  return Math.min(...Object.values(data.y).map((arr) => Math.min(...arr)));
};

export const getMaxYFromMassagedData = (data: MassagedData): number => {
  return Math.max(...Object.values(data.y).map((arr) => Math.max(...arr)));
};
