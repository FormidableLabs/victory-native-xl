"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueFromSidedNumber = void 0;
const valueFromSidedNumber = (sidedNumber, side, defaultValue = 0) => {
    "worklet";
    return typeof sidedNumber === "number"
        ? sidedNumber
        : (sidedNumber === null || sidedNumber === void 0 ? void 0 : sidedNumber[side]) || defaultValue;
};
exports.valueFromSidedNumber = valueFromSidedNumber;
