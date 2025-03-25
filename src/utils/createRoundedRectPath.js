export const createRoundedRectPath = (x, y, barWidth, barHeight, roundedCorners, yValue) => {
    const corners = { ...roundedCorners };
    if (Number(yValue) < 0) {
        [
            corners.topLeft,
            corners.topRight,
            corners.bottomLeft,
            corners.bottomRight,
        ] = [
            corners.bottomLeft,
            corners.bottomRight,
            corners.topLeft,
            corners.topRight,
        ];
    }
    const topLeft = Math.min((Math.ceil(barWidth) / 2, corners.topLeft) || 0);
    const topRight = Math.min((Math.ceil(barWidth) / 2, corners.topRight) || 0);
    const bottomLeft = Math.min((Math.ceil(barWidth) / 2, corners.bottomLeft) || 0);
    const bottomRight = Math.min((Math.ceil(barWidth) / 2, corners.bottomRight) || 0);
    const nonUniformRoundedRect = {
        rect: {
            x: x,
            y: y,
            width: barWidth,
            height: barHeight,
        },
        topLeft: { x: topLeft, y: topLeft },
        topRight: { x: topRight, y: topRight },
        bottomRight: { x: bottomRight, y: bottomRight },
        bottomLeft: { x: bottomLeft, y: bottomLeft },
    };
    return nonUniformRoundedRect;
};
