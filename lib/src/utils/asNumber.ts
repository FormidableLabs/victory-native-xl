export const asNumber = (val: unknown): number =>
  typeof val === "number" ? val : Number(val);
