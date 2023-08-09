export const map = (
  value: number,
  xi: number,
  xf: number,
  yi: number,
  yf: number,
) => {
  "worklet";
  return yi + ((yf - yi) * (value - xi)) / (xf - xi);
};
