export const asNumber = (val: unknown): number => {
  "worklet";
  return typeof val === "number" ? val : Number(val);
};
