"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeScale = void 0;
const d3_scale_1 = require("d3-scale");
const makeScale = ({ inputBounds, outputBounds, padStart, padEnd, isNice = false, }) => {
    // Linear
    const scale = (0, d3_scale_1.scaleLinear)().domain(inputBounds).range(outputBounds);
    if (padStart || padEnd) {
        scale
            .domain([
            scale.invert(outputBounds[0] - (padStart !== null && padStart !== void 0 ? padStart : 0)),
            scale.invert(outputBounds[1] + (padEnd !== null && padEnd !== void 0 ? padEnd : 0)),
        ])
            .range(outputBounds);
    }
    if (isNice)
        scale.nice();
    return scale;
};
exports.makeScale = makeScale;
