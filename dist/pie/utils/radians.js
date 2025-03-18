"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.degreesToRadians = degreesToRadians;
exports.calculatePointOnCircumference = calculatePointOnCircumference;
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function calculatePointOnCircumference(center, radius, angleInRadians) {
    return {
        x: center.x + radius * Math.cos(angleInRadians),
        y: center.y + radius * Math.sin(angleInRadians),
    };
}
