"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffsetFromAngle = void 0;
const getOffsetFromAngle = (rotateAngle) => {
    if (!rotateAngle)
        return 0;
    return Math.sin((Math.PI / 180) * rotateAngle);
};
exports.getOffsetFromAngle = getOffsetFromAngle;
