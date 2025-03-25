export const asNumber = (val) => {
    "worklet";
    return typeof val === "number" ? val : NaN;
};
