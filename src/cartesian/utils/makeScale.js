import { scaleLinear } from "d3-scale";
export const makeScale = ({ inputBounds, outputBounds, padStart, padEnd, viewport, isNice = false, }) => {
    // Linear
    const viewScale = scaleLinear()
        .domain(viewport ?? inputBounds)
        .range(outputBounds);
    const scale = scaleLinear()
        .domain(inputBounds)
        .range([viewScale(inputBounds[0]), viewScale(inputBounds[1])]);
    if (padStart || padEnd) {
        scale
            .domain([
            scale.invert(outputBounds[0] - (padStart ?? 0)),
            scale.invert(outputBounds[1] + (padEnd ?? 0)),
        ])
            .range(outputBounds);
    }
    if (isNice)
        scale.nice();
    return scale;
};
