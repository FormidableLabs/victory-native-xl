"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeScale = void 0;
const d3_scale_1 = require("d3-scale");
const makeScale = ({ inputBounds, outputBounds, padStart, padEnd, viewport, isNice = false, }) => {
    // Linear
    const viewScale = (0, d3_scale_1.scaleLinear)()
        .domain(viewport !== null && viewport !== void 0 ? viewport : inputBounds)
        .range(outputBounds);
    const scale = (0, d3_scale_1.scaleLinear)()
        .domain(inputBounds)
        .range([viewScale(inputBounds[0]), viewScale(inputBounds[1])]);
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
