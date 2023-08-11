import { InputDatum, MassagedData } from "../charts/types";

export const massageInputData = (
  data: InputDatum[],
  xKey: string,
  yKeys: string[],
): MassagedData => {
  const x: number[] = [];
  const y: Record<string, number[]> = {};
  const _x: (number | string)[] = [];

  if (!data.length) return { x, y, _x };

  const firstX = data[0][xKey];

  // TODO: Going to need more sophisticated sorting logic for e.g. dates.
  const sortedData = Array.from(data);
  if (typeof firstX === "number") {
    sortedData.sort((a, b) => (a[xKey] as number) - (b[xKey] as number));
  }

  // Input data is numbers
  if (typeof firstX === "number") {
    sortedData.forEach((datum) => {
      const xVal = datum[xKey] as number;
      x.push(xVal);
      yKeys.forEach((key) => {
        if (!y[key]) y[key] = [];
        y[key].push(datum[key] as number);
      });
    });
  }

  // Input data is string
  if (typeof firstX === "string") {
    sortedData.forEach((datum, i) => {
      x.push(i);
      _x.push(datum[xKey] as string);
      yKeys.forEach((key) => {
        if (!y[key]) y[key] = [];
        y[key].push(datum[key] as number);
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
