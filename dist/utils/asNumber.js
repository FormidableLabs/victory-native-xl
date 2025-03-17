"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asNumber = void 0;
const asNumber = (val) => {
    "worklet";
    return typeof val === "number" ? val : NaN;
};
exports.asNumber = asNumber;
