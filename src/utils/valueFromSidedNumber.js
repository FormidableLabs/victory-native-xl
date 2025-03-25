export const valueFromSidedNumber = (sidedNumber, side, defaultValue = 0) => {
    "worklet";
    return typeof sidedNumber === "number"
        ? sidedNumber
        : sidedNumber?.[side] || defaultValue;
};
