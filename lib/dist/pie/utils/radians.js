"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePointOnCircumference = exports.degreesToRadians = void 0;
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
exports.degreesToRadians = degreesToRadians;
function calculatePointOnCircumference(center, radius, angleInRadians) {
    return {
        x: center.x + radius * Math.cos(angleInRadians),
        y: center.y + radius * Math.sin(angleInRadians),
    };
}
exports.calculatePointOnCircumference = calculatePointOnCircumference;
