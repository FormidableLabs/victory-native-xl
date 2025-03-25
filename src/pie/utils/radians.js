export function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
export function calculatePointOnCircumference(center, radius, angleInRadians) {
    return {
        x: center.x + radius * Math.cos(angleInRadians),
        y: center.y + radius * Math.sin(angleInRadians),
    };
}
